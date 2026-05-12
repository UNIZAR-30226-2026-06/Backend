// src/core/game/game.runner.js
const { withGameLock } = require('./lock.manager');
const db = require('../../config/db');
const GameLogic = require('./game.logic');
const { cargarPartidaEnMemoria } = require('./game.loader');
const { activeGames } = require('./game.registry');

const BOT_THINKING_DELAY_MS = 2000;
const BOT_CHAIN_SAFETY = 30;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function safeEmit(gameId, event, payload) {
  try {
    const { getIO } = require('../../realtime/socket.server');
    getIO().to(gameId).emit(event, payload);
  } catch (err) {
    console.error(`[Sockets] Error emitiendo ${event} en partida ${gameId}:`, err.message);
  }
}

async function runBotsChain(gameId, logic, gameState) {
  let iterations = 0;
  while (
    gameState.phase === 'playing' &&
    gameState.getCurrentPlayer()?.isBot &&
    iterations++ < BOT_CHAIN_SAFETY
  ) {
    const botId = gameState.getCurrentPlayer().id;

    safeEmit(gameId, 'bot_thinking', { botId });
    await sleep(BOT_THINKING_DELAY_MS);

    // La partida puede haberse pausado durante el sleep
    if (gameState.phase !== 'playing') break;

    const decision = logic.botLogic.decideMove(botId);
    let actionType;
    let cardPlayed = null;

    if (decision.type === 'play') {
      const cardToPlay = { ...decision.card };
      if (decision.chosenColor) cardToPlay.chosenColor = decision.chosenColor;
      if (decision.cancelColor) cardToPlay.cancelColor = decision.cancelColor;
      try {
        logic.playCard(botId, cardToPlay);
        actionType = 'play';
        cardPlayed = cardToPlay;
      } catch (playErr) {
        const card = logic.drawCard();
        gameState.addCardToPlayer(botId, card);
        gameState.advanceTurn();
        gameState.setNewTurnDeadline(30000);
        actionType = 'draw';
      }
    } else {
      const card = logic.drawCard();
      gameState.addCardToPlayer(botId, card);
      gameState.advanceTurn();
      gameState.setNewTurnDeadline(30000);
      actionType = 'draw';
    }

    gameState.needsPersistence = true;

    safeEmit(gameId, 'bot_action', {
      botId,
      action: actionType,
      cardPlayed,
    });
    safeEmit(gameId, 'game_state_updated', {
      lastAction: actionType,
      player: botId,
      cardId: cardPlayed?.id || null,
    });

    if (gameState.players.some((p) => p.hand.length === 0)) break;
  }
}

/**
 * Ejecuta un ciclo de juego seguro con lock por partida.
 * @param {string} gameId 
 * @param {Function|null} actionFn - Función opcional que recibe (logic, gameState)
 * @returns {GameState}
 */
async function runGameCycle(gameId, actionFn = null) {
  let triggerBotsAfterRelease = false;

  const result = await withGameLock(gameId, async () => {
    let gameState = activeGames.get(gameId);

    // Cargar desde DB si no está en memoria
    if (!gameState) {
      gameState = await cargarPartidaEnMemoria(gameId);
    }

    // Si la partida está pausada y no hay una acción explícita (como votar o reanudar), 
    // detenemos el ciclo aquí para que el tiempo y los bots se congelen.
    if (gameState.phase === 'paused' && !actionFn) {
      return gameState;
    }

    const logic = new GameLogic(gameState);

    // Solo resolvemos timeouts si la partida NO está pausada
    if (gameState.phase !== 'paused') {
      const timedOutPlayer = logic.resolveTimeoutIfNeeded();
      if (timedOutPlayer) {
        gameState.needsPersistence = true;
        safeEmit(gameId, 'turno_expirado', {
          jugador: timedOutPlayer,
          siguienteJugador: gameState.getCurrentPlayer()?.id || null,
          turnDeadline: gameState.turnDeadline,
        });
        safeEmit(gameId, 'game_state_updated', {
          lastAction: 'timeout',
          player: timedOutPlayer,
        });
      }
    }

    // Ejecutar acción externa si se pasó
    let actionResult;
    if (actionFn) {
      actionResult = await actionFn(logic, gameState);

      if (gameState.phase === 'playing' && gameState.getCurrentPlayer()?.isBot) {
        triggerBotsAfterRelease = true;
      }
    } else if (gameState.phase === 'playing') {
      await runBotsChain(gameId, logic, gameState);
    }

    //comprobamos si hay un gandor, y si lo hay le sumamos 50 monedas

    if (gameState.phase === 'playing') {
      const ganador = gameState.players.find(p => p.hand.length === 0);
      
      if (ganador) {
        gameState.phase = 'finished';
        gameState.needsPersistence = true;

        try {
          const { getIO } = require('../../realtime/socket.server');
          const io = getIO();
          let nuevasMonedas = null;

          // Si el ganador es humano, le sumamos 50 monedas en la base de datos
          if (!ganador.isBot) {
            const result = await db.query(
              `UPDATE notuno.usuario 
               SET monedas = monedas + 50 
               WHERE nombre_usuario = $1 
               RETURNING monedas`,
              [ganador.id]
            );
            
            if (result.rowCount > 0) {
              nuevasMonedas = result.rows[0].monedas;
            }
          }

          const perdedoresHumanos = gameState.players.filter(
            p => !p.isBot && p.id !== ganador.id
          );
          let monedasPerdedores = {};
          if (perdedoresHumanos.length > 0) {
            const ids = perdedoresHumanos.map(p => p.id);
            const resPerdedores = await db.query(
              `UPDATE notuno.usuario 
               SET monedas = monedas + 10 
               WHERE nombre_usuario = ANY($1::text[]) 
               RETURNING nombre_usuario, monedas`,
              [ids]
            );
            resPerdedores.rows.forEach(r => {
              monedasPerdedores[r.nombre_usuario] = r.monedas;
            });
          }

          // Emitimos a toda la sala que la partida ha terminado
          io.to(gameId).emit('game_finished', { 
            winner: ganador.id,
            isBot: ganador.isBot,
            recompensa: nuevasMonedas ? 50 : 0,
            monedasTotales: nuevasMonedas,
            recompensaPerdedor: 10,
            monedasPerdedores
          });

        } catch (err) {
          console.error(`[Fin Partida] Error al procesar victoria en ${gameId}:`, err.message);
        }
      }
    }

    // Persistencia opcional
    if (gameState.needsPersistence) {
      if (
        (gameState.phase === 'playing' || gameState.phase === 'paused') &&
        (!Array.isArray(gameState.drawPile) || gameState.drawPile.length === 0) &&
        (!Array.isArray(gameState.discardPile) || gameState.discardPile.length === 0)
      ) {
        gameState.needsPersistence = false;
      } else {
        // Actualizamos también la columna 'estado' para que la base de datos sepa si está pausada, en curso o finalizada.
        let estadoDB = 'en_curso';
        if (gameState.phase === 'paused') estadoDB = 'pausada';
        if (gameState.phase === 'finished') estadoDB = 'finalizada';
        await db.query(
          `UPDATE notuno.partida SET game_state=$2, estado=$3, updated_at=NOW() WHERE id_partida=$1`,
          [gameId, JSON.stringify(gameState), estadoDB]
        );
        gameState.needsPersistence = false;
      }
    }

    return actionFn ? actionResult : gameState;
  });
  if (triggerBotsAfterRelease) {
    setImmediate(() => {
      runGameCycle(gameId).catch((err) => {
        console.error(`[BotsChain] Error en cadena de bots ${gameId}:`, err.message);
      });
    });
  }

  return result;
}

module.exports = { runGameCycle };