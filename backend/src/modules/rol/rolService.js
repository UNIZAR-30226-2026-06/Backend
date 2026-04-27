const db = require('../../config/db');
const { activeGames } = require('../../core/game-engine/game.registry');
const { cargarPartidaEnMemoria } = require('../../core/game-engine/game.loader');
const { runGameCycle } = require('../../core/game-engine/game.runner');
const RoleLogic = require('../../core/game-engine/role.logic');

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function loadGameState(gameId) {
  return activeGames.get(gameId) || cargarPartidaEnMemoria(gameId);
}

async function loadRolesCatalog(client = db) {
  const result = await client.query(
    `SELECT id_rol, imagen, nombre, num_usos_max
     FROM notuno.rol
     ORDER BY id_rol ASC`
  );

  return result.rows;
}

function buildRoleResponse(gameState, player, roleRow) {
  const role = roleRow || player.rol;
  const maxUses = role?.num_usos_max ?? null;
  const blocked = RoleLogic.isRoleBlockedForPlayer(gameState, player.id);

  return {
    gameId: gameState.id,
    playerId: player.id,
    role,
    uses: player.rolUses ?? 0,
    maxUses,
    lastUsedTurn: player.rolLastUsedTurn ?? null,
    canUseNow:
      gameState.phase === 'playing' &&
      gameState.getCurrentPlayer()?.id === player.id &&
      !blocked &&
      (maxUses == null || player.rolUses < maxUses) &&
      player.rolLastUsedTurn !== gameState.turnNumber
  };
}

async function asignarRolesIniciales(gameId, gameState, client) {
  if (!gameState.rolesMode) {
    return { assigned: 0 };
  }

  const rolesCatalog = await loadRolesCatalog(client);
  const assignments = RoleLogic.assignRandomRoles(gameState, rolesCatalog);

  for (const assignment of assignments) {
    await client.query(
      `UPDATE notuno.usuario_en_partida
       SET id_rol = $2,
           usos_rol_partida = 0
       WHERE id_partida = $1 AND id_usuario = $3`,
      [
        gameId,
        assignment.role.id_rol,
        assignment.playerId
      ]
    );
  }

  await client.query(
    `UPDATE notuno.partida
     SET game_state = $2
     WHERE id_partida = $1`,
    [gameId, JSON.stringify(gameState)]
  );

  return { assigned: assignments.length };
}

async function getMiRol(gameId, username) {
  const gameState = await loadGameState(gameId);

  if (!gameState.rolesMode) {
    throw httpError(400, 'La partida no tiene roles activados');
  }

  const player = gameState.getPlayerById(username);
  if (!player) {
    throw httpError(404, 'Jugador no encontrado en la partida');
  }

  if (!player.rol) {
    throw httpError(404, 'El rol todavía no ha sido asignado');
  }

  return buildRoleResponse(gameState, player);
}

async function getMisUsos(gameId, username) {
  const gameState = await loadGameState(gameId);
  const player = gameState.getPlayerById(username);

  if (!player) {
    throw httpError(404, 'Jugador no encontrado en la partida');
  }

  return {
    gameId,
    playerId: username,
    uses: player.rolUses ?? 0,
    lastUsedTurn: player.rolLastUsedTurn ?? null,
    maxUses: player.rol?.num_usos_max ?? null
  };
}

async function usarRol(gameId, username, payload = {}) {
  return runGameCycle(gameId, async (logic, gameState) => {
    if (!gameState.rolesMode) {
      throw httpError(400, 'La partida no tiene roles activados');
    }

    if (gameState.phase !== 'playing') {
      throw httpError(400, 'La partida no está en juego');
    }

    const currentPlayer = gameState.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== username) {
      throw httpError(403, 'Solo puedes usar tu rol en tu turno');
    }

    const player = gameState.getPlayerById(username);
    if (!player) {
      throw httpError(404, 'Jugador no encontrado en la partida');
    }

    if (!player.rol) {
      throw httpError(400, 'El jugador no tiene rol asignado');
    }

    if (RoleLogic.isRoleBlockedForPlayer(gameState, username)) {
      throw httpError(403, 'Las habilidades están bloqueadas durante esta ronda');
    }

    if (player.rolLastUsedTurn === gameState.turnNumber) {
      throw httpError(400, 'El rol ya se ha usado en este turno');
    }

    const maxUses = player.rol?.num_usos_max ?? null;
    if (maxUses != null && player.rolUses >= maxUses) {
      throw httpError(400, 'El rol ha alcanzado su máximo de usos');
    }

    const result = RoleLogic.executeRoleAction(gameState, username, payload);

    player.rolUses = (player.rolUses ?? 0) + 1;
    player.rolLastUsedTurn = gameState.turnNumber;
    gameState.needsPersistence = true;

    await db.query(
      `UPDATE notuno.usuario_en_partida
       SET usos_rol_partida = $2
       WHERE id_partida = $1 AND id_usuario = $3`,
      [gameId, player.rolUses, username]
    );

    if (gameState.needsPersistence) {
      await db.query(
        `UPDATE notuno.partida
         SET game_state = $2
         WHERE id_partida = $1`,
        [gameId, JSON.stringify(gameState)]
      );
      gameState.needsPersistence = false;
    }

    try {
      const { getIO } = require('../../realtime/socket.server');
      const io = getIO();
      io.to(gameId).emit('game_state_updated', {
        lastAction: 'role',
        player: username,
        role: player.rol?.nombre || null
      });
    } catch (error) {
      console.error(`[Sockets] Error emitiendo uso de rol en partida ${gameId}:`, error.message);
    }

    return {
      success: true,
      role: player.rol,
      result
    };
  });
}

module.exports = {
  asignarRolesIniciales,
  getMiRol,
  getMisUsos,
  usarRol,
  loadRolesCatalog
};