class CardRules {
  constructor(state, gameLogic) {
    this.state = state;
    this.gameLogic = gameLogic;
  }

  canPlay(card) {
    const currentCard = this.state.getTopDiscard();

    if (card.color === 'black') {
      if (
        currentCard &&
        (card.value === '+4' || card.value === '+4R') &&
        (currentCard.value === '+4' || currentCard.value === '+4R')
      ) {
        return false;
      }
      return true;
    }

    // ─── CARTAS NO-WILD: aplican filtros y match normal ───────────────
    const currentPlayer = this.state.getCurrentPlayer();

    const filterFn = this.state.getFilter(currentPlayer.id);
    if (filterFn && !filterFn(card.value, card)) return false;

    // Bloqueo por cancelColor: si el color de la carta jugada coincide
    // con el color cancelado, no se puede jugar.
    const blockedColor = this.state.getBlockedColor
      ? this.state.getBlockedColor(currentPlayer.id)
      : null;
    if (blockedColor) {
      const cardColor = this.state.getCardColor(card);
      if (cardColor === blockedColor) return false;
    }

    let referenceCard = currentCard;
    if (currentCard && currentCard.value === 'cancelColor') {
      const pile = this.state.discardPile || [];
      // discardPile termina con la cancelColor; cogemos la anterior.
      if (pile.length >= 2) {
        referenceCard = pile[pile.length - 2];
      }
      // Si no hubiera carta previa (caso degenerado), tratamos el
      // cancelColor como una wild "limpia": cualquier color válido pasa.
      else {
        return true;
      }
    }

    const currentColor = this.state.getCardColor(referenceCard);
    const cardColor = this.state.getCardColor(card);

    return !referenceCard
      || cardColor === currentColor
      || card.value === referenceCard.value;
  }

  applyEffect(card, playerID) {
    switch (card.value) {
      case '+2':
      case 'draw2':
      case '+2R':
        this.state.reverseDirection();
        this.applyDraw(playerID, 2);
        this.state.skipNextTurn();
        break;
      case '+4':
      case 'draw4':
        this.state.reverseDirection();
        this.applyDraw(playerID, 4);
        this.state.skipNextTurn();
        break;
      case '+4R':
        this.state.reverseDirection();
        this.applyDraw(playerID, 4);
        this.state.skipNextTurn();
        break;
      case '+1':
        this.applyDrawToAllPlayers(1);
        break;
      case 'reverse':
        this.state.reverseDirection();
        if (this.state.getPlayersCount() === 2) {
          this.state.skipNextTurn();
        }
        break;
      case 'skip':
        this.state.skipNextTurn();
        break;
      case 'extraTurn':
        this.state.setNewTurnDeadline(30000);
        return false;
      case 'swapHands':
        this.gameLogic.swapHands();
        break;
      case 'discardHandRedraw':
        this.gameLogic.discardHandAndRedraw(playerID);
        break;
      case 'restartGame':
        this.gameLogic.restartGame();
        return false;
      case 'specialOnly':
        this.setSpecialOnlyFilter();
        break;
      case 'changeColor':
        break;
      case 'cancelColor':
        if (card.cancelColor) {
          this.setCancelColorBlock(card.cancelColor);
        }
        break;
      case 'changeRole':
        if (this.state.rolesMode && Array.isArray(this.state.rolesCatalog) && this.state.rolesCatalog.length > 0) {
          const RoleLogic = require('./role.logic');
          RoleLogic.reassignRoleForPlayer(this.state, playerID, this.state.rolesCatalog);
        }
        // Renovamos la deadline para el turno extra.
        this.state.setNewTurnDeadline(30000);
        return false;
      case 'addRoleUse':
        {
          const player = this.state.getPlayerById(playerID);
          if (player && (player.rolUses ?? 0) > 0) {
            player.rolUses = (player.rolUses ?? 0) - 1;
          }
        }
        this.state.setNewTurnDeadline(30000);
        return false;
      case 'playOdd':
      case 'playEven':
        const nextPlayer = this.state.getNextPlayer();
        this.state.setFilter(
          nextPlayer.id,
          card.value === 'playOdd'
            ? val => parseInt(val, 10) % 2 === 1
            : val => parseInt(val, 10) % 2 === 0,
          1
        );
        break;
      default:
        break;
    }

    return true;
  }

  applyDraw(playerID, count) {
    const targetPlayer = this.state.getNextPlayer();
    for (let i = 0; i < count; i++) {
      const card = this.gameLogic.drawCard();
      this.state.addCardToPlayer(targetPlayer.id, card);
    }
  }

  applyDrawToAllPlayers(count) {
    for (const player of this.state.players) {
      for (let i = 0; i < count; i++) {
        const card = this.gameLogic.drawCard();
        this.state.addCardToPlayer(player.id, card);
      }
    }
  }

  setSpecialOnlyFilter() {
    const nextPlayer = this.state.getNextPlayer();
    this.state.setFilter(
      nextPlayer.id,
      value => !/^\d+$/.test(String(value)),
      1
    );
  }

  setCancelColorBlock(blockedColor) {
    const nextPlayer = this.state.getNextPlayer();
    this.state.setFilter(
      nextPlayer.id,
      (_value, card) => {
        if (!card) return true;
        const cardColor = this.state.getCardColor(card);
        return cardColor !== blockedColor;
      },
      1
    );
    if (this.state.setBlockedColor) {
      this.state.setBlockedColor(nextPlayer.id, blockedColor, 1);
    }
  }
}

module.exports = CardRules;