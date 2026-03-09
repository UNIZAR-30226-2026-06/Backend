// src/core/game-engine/turn.manager.js
class TurnManager {
    constructor(state) {
        this.state = state;
        this.turnFilters = {}; // filtros temporales por jugador
    }

    getCurrentPlayer() {
        const player = this.state.getCurrentPlayer();
        return player;
    }

    next() {
        const current = this.state.getCurrentTurnIndex();
        const dir = this.state.getDirection();
        const total = this.state.getPlayersCount();

        // avanzar al siguiente jugador
        let nextIndex = (current + dir + total) % total;

        // limpiar filtros del jugador que acaba de jugar
        const currentPlayerId = this.state.getCurrentPlayer().id;
        this.clearFilter(currentPlayerId);

        this.state.setCurrentTurnIndex(nextIndex);
    }

    advance(steps = 1) {
        const total = this.state.getPlayersCount();
        if (total === 0) return;
        const current = this.state.getCurrentTurnIndex();
        const dir = this.state.getDirection();
        const next = (current + dir * steps + total) % total;
        this.state.setCurrentTurnIndex(next);
    }

    skip(times = 1) {
        this.advance(times + 1);
    }

    reverse() {
        const currentDir = this.state.getDirection();
        this.state.setDirection(-currentDir);
    }

    stay() {
        // no hacer nada, jugador repite turno
    }

    // ==========================
    // filtros temporales
    // ==========================
    setFilter(playerId, filterFn) {
        this.turnFilters[playerId] = filterFn;
    }

    clearFilter(playerId) {
        delete this.turnFilters[playerId];
    }

    getFilter(playerId) {
        return this.turnFilters[playerId] || null;
    }

    getNextPlayer() {
        const current = this.state.getCurrentTurnIndex();
        const dir = this.state.getDirection();
        const total = this.state.getPlayersCount();

        const nextIndex = (current + dir + total) % total;
        return this.state.getPlayers()[nextIndex];
    }
}

module.exports = TurnManager;