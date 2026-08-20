// Pure-DDZ-Classic V1.0.7 Game Master Loop
// Connect player turn, AI turn and game state.

const DDZGameMasterLoop = {
  state: 'idle',
  currentPlayer: 0,
  players: [],
  history: [],

  start(players = []) {
    this.players = players;
    this.currentPlayer = 0;
    this.history = [];
    this.state = 'running';
    return this.nextTurn();
  },

  nextTurn() {
    if (this.state !== 'running') return null;
    const player = this.players[this.currentPlayer];
    return player || null;
  },

  recordPlay(player, cards) {
    this.history.push({ player, cards });
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    return this.nextTurn();
  },

  finish(result) {
    this.state = 'finished';
    return result;
  }
};

if (typeof window !== 'undefined') {
  window.DDZGameMasterLoop = DDZGameMasterLoop;
}
