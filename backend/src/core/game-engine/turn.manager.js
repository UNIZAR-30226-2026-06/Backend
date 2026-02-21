class TurnManager {
    constructor(state) {
        this.state = state;
    }
    getCurrentPlayer(){
        return this.state.getCurrentPlayer();
    }
    next(){
        this.advance(1);
       
    }

    advance(steps = 1){
        const total = this.state.getPlayersCount();
        const current = this.state.getCurrentTurnIndex();
        const dir = this.state.getDirection();
        const next = (current + dir * steps + total) % total;
        this.state.setCurrentTurnIndex(next);
    }
    skip(times = 1){
        this.advance(times + 1);
    }
    reverse(){
        const currentDir = this.state.getDirection();
        this.state.setDirection(-currentDir);
    }
}