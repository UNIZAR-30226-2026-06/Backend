class TurnManager {
  constructor(state) {
    this.state = state;
    this.turnFilters = {};
  }

  getCurrentPlayer() {
    return this.state.getCurrentPlayer();
  }

  next() {
    const current = this.state.getCurrentTurnIndex();
    const dir = this.state.getDirection();
    const total = this.state.getPlayersCount();

    let nextIndex = (current + dir + total) % total;

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
    this.state.setDirection(-this.state.getDirection());
  }

  stay() {}

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
    return this.state.getPlayerByIndex(current + dir);
  }
}

module.exports = TurnManager;