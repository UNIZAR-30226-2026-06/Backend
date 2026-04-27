const ACCENT_REPLACEMENTS = /[\u0300-\u036f]/g;

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(ACCENT_REPLACEMENTS, '')
    .toLowerCase()
    .trim();
}

function cloneCard(card) {
  return card ? { ...card } : null;
}

function getRoleKey(role) {
  const rawName = typeof role === 'string' ? role : role?.nombre || role?.name || role?.rol || '';
  const normalized = normalizeText(rawName);

  if (normalized === 'espia') return 'espia';
  if (normalized === 'ladron') return 'ladron';
  if (normalized === 'anular cartas') return 'anular_cartas';
  if (normalized === 'transformar carta') return 'transformar_carta';
  if (normalized === 'mirar la siguiente carta del mazo') return 'mirar_siguiente_carta';
  if (normalized === 'bloquear habilidades') return 'bloquear_habilidades';

  return null;
}

function getRoleDefinition(role) {
  const key = getRoleKey(role);
  if (!key) return null;

  const definitions = {
    espia: { key, nombre: 'Espía' },
    ladron: { key, nombre: 'Ladrón' },
    anular_cartas: { key, nombre: 'Anular cartas' },
    transformar_carta: { key, nombre: 'Transformar carta' },
    mirar_siguiente_carta: { key, nombre: 'Mirar la siguiente carta del mazo' },
    bloquear_habilidades: { key, nombre: 'Bloquear habilidades' }
  };

  return definitions[key];
}

function assignRandomRoles(gameState, rolesCatalog) {
  if (!Array.isArray(rolesCatalog) || rolesCatalog.length === 0) {
    throw new Error('No hay roles configurados');
  }

  const assignments = [];

  for (const player of gameState.players) {
    const roleRow = rolesCatalog[Math.floor(Math.random() * rolesCatalog.length)];

    player.rol = {
      id_rol: roleRow.id_rol,
      nombre: roleRow.nombre,
      imagen: roleRow.imagen,
      num_usos_max: roleRow.num_usos_max
    };
    player.rolUses = 0;
    player.rolLastUsedTurn = null;

    assignments.push({
      playerId: player.id,
      role: cloneCard(player.rol)
    });
  }

  return assignments;
}

function getPlayerRole(gameState, playerId) {
  const player = gameState.getPlayerById(playerId);
  if (!player) {
    throw new Error('Jugador no encontrado');
  }

  return player.rol ?? null;
}

function isRoleBlockedForPlayer(gameState, playerId) {
  if (!gameState.roleBlock) return false;
  if (gameState.roleBlock.blockerId === playerId) return false;
  return gameState.turnNumber < gameState.roleBlock.activeUntilTurn;
}

function discardCardFromHand(gameState, player, cardId) {
  const cardIndex = player.hand.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) {
    throw new Error('La carta no pertenece al jugador');
  }

  const [discardedCard] = player.hand.splice(cardIndex, 1);
  gameState.addToDiscardPile(discardedCard);
  return discardedCard;
}

function executeRoleAction(gameState, playerId, payload = {}) {
  const player = gameState.getPlayerById(playerId);
  if (!player) {
    throw new Error('Jugador no encontrado');
  }

  const role = getRoleDefinition(player.rol);
  if (!role) {
    throw new Error('El jugador no tiene un rol asignado');
  }

  switch (role.key) {
    case 'espia': {
      const targetPlayerId = payload.targetPlayerId || payload.targetUserId;
      if (!targetPlayerId) throw new Error('targetPlayerId es requerido');

      const targetPlayer = gameState.getPlayerById(targetPlayerId);
      if (!targetPlayer) throw new Error('Jugador objetivo no encontrado');
      if (targetPlayer.id === player.id) throw new Error('No puedes espiar tus propias cartas');

      return {
        targetPlayerId: targetPlayer.id,
        targetHand: targetPlayer.hand.map(cloneCard)
      };
    }

    case 'ladron': {
      const targetPlayerId = payload.targetPlayerId || payload.targetUserId;
      const ownCardId = payload.ownCardId || payload.cardId;

      if (!targetPlayerId) throw new Error('targetPlayerId es requerido');
      if (!ownCardId) throw new Error('ownCardId es requerido');

      const targetPlayer = gameState.getPlayerById(targetPlayerId);
      if (!targetPlayer) throw new Error('Jugador objetivo no encontrado');
      if (targetPlayer.id === player.id) throw new Error('No puedes robarte a ti mismo');
      if (targetPlayer.hand.length === 0) throw new Error('El jugador objetivo no tiene cartas');

      const ownCardIndex = player.hand.findIndex((card) => card.id === ownCardId);
      if (ownCardIndex === -1) throw new Error('La carta propia no pertenece al jugador');

      const targetCardIndex = Math.floor(Math.random() * targetPlayer.hand.length);
      const [ownCard] = player.hand.splice(ownCardIndex, 1);
      const [targetCard] = targetPlayer.hand.splice(targetCardIndex, 1);

      player.hand.push(targetCard);
      targetPlayer.hand.push(ownCard);

      return {
        targetPlayerId: targetPlayer.id,
        receivedCard: cloneCard(targetCard)
      };
    }

    case 'anular_cartas': {
      const cardId = payload.cardId;
      if (!cardId) throw new Error('cardId es requerido');

      const discardedCard = discardCardFromHand(gameState, player, cardId);
      return {
        discardedCard: cloneCard(discardedCard)
      };
    }

    case 'transformar_carta': {
      const cardId = payload.cardId;
      const newColor = payload.newColor;
      const newNumber = payload.newNumber;

      if (!cardId) throw new Error('cardId es requerido');
      if (newColor == null && newNumber == null) {
        throw new Error('newColor o newNumber es requerido');
      }

      const card = player.hand.find((item) => item.id === cardId);
      if (!card) throw new Error('La carta no pertenece al jugador');
      if (card.type !== 'normal') throw new Error('Solo se pueden transformar cartas numéricas');

      if (newColor != null) {
        card.color = String(newColor);
      }

      if (newNumber != null) {
        card.value = String(newNumber);
      }

      return {
        updatedCard: cloneCard(card)
      };
    }

    case 'mirar_siguiente_carta': {
      const nextCard = cloneCard(gameState.drawPile[0] || null);
      return {
        nextCard
      };
    }

    case 'bloquear_habilidades': {
      gameState.roleBlock = {
        blockerId: player.id,
        activeUntilTurn: gameState.turnNumber + gameState.players.length
      };

      return {
        blockedUntilTurn: gameState.roleBlock.activeUntilTurn,
        blockerId: player.id
      };
    }

    default:
      throw new Error('Rol no soportado');
  }
}

module.exports = {
  assignRandomRoles,
  executeRoleAction,
  getPlayerRole,
  getRoleDefinition,
  getRoleKey,
  isRoleBlockedForPlayer
};