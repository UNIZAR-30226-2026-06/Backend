// src/core/game/game.runner.js
const { withGameLock } = require('./lock.manager');
const db = require('../../config/db');
const GameLogic = require('./game.logic');
const { cargarPartidaEnMemoria } = require('./game.loader');
const { activeGames } = require('./game.registry');


/**
 * Ejecuta un ciclo de juego seguro con lock por partida.
 * @param {string} gameId 
 * @param {Function|null} actionFn - Función opcional que recibe (logic, gameState)
 * @returns {GameState}
 */
async function runGameCycle(gameId, actionFn = null) {
  return withGameLock(gameId, async () => {
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
      logic.resolveTimeoutIfNeeded();
    }

    // Ejecutar acción externa si se pasó
    if (actionFn) {
      await actionFn(logic, gameState);
    }

    else if (gameState.phase === 'playing') {
      const currentPlayer = gameState.getCurrentPlayer();
      
      // Si el turno actual es de un Bot, le hacemos jugar
      if (currentPlayer.isBot) {
        const decision = logic.botLogic.decideMove(currentPlayer.id);
        let actionType = '';

        if (decision.type === 'play') {
          logic.playCard(currentPlayer.id, decision.card);
          actionType = 'play';
        } else {
          // El bot no tiene cartas válidas, roba y pasa turno
          const card = logic.drawCard();
          gameState.addCardToPlayer(currentPlayer.id, card);
          gameState.advanceTurn();
          gameState.setNewTurnDeadline(30000); // 30 segundos para el siguiente turno
          actionType = 'draw';
        }

        gameState.needsPersistence = true;

        // Avisamos a todos los jugadores de la partida mediante Sockets
        try {
          const { getIO } = require('../../realtime/socket.server');
          const io = getIO();
          // Asume que todos los jugadores de esta partida hicieron socket.join(gameId)
          io.to(gameId).emit('bot_action', {
            botId: currentPlayer.id,
            action: actionType,
            cardPlayed: decision.type === 'play' ? decision.card : null
          });
          
          // Opcionalmente, puedes enviar el estado completo actualizado para que el frontend lo pinte de nuevo:
          io.to(gameId).emit('game_state_updated', gameState);
        } catch (err) {
          console.error(`[Sockets] Error emitiendo acción de bot en partida ${gameId}:`, err.message);
        }
      }
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

          // Emitimos a toda la sala que la partida ha terminado
          io.to(gameId).emit('game_finished', { 
            winner: ganador.id,
            isBot: ganador.isBot,
            recompensa: nuevasMonedas ? 50 : 0,
            monedasTotales: nuevasMonedas 
          });

        } catch (err) {
          console.error(`[Fin Partida] Error al procesar victoria en ${gameId}:`, err.message);
        }
      }
    }

    // Persistencia opcional
    if (gameState.needsPersistence) {
      // Actualizamos también la columna 'estado' para que la base de datos sepa si está pausada, en curso o finalizada.
      let estadoDB = 'en_curso';
      if (gameState.phase === 'paused') estadoDB = 'pausada';
      if (gameState.phase === 'finished') estadoDB = 'finalizada';
      await db.query(
        `UPDATE notuno.partida SET game_state=$2, updated_at=NOW() WHERE id_partida=$1`,
        [gameId, JSON.stringify(gameState)]
      );
      gameState.needsPersistence = false; // resetear flag
    }

    return gameState;
  });
}

module.exports = { runGameCycle };
