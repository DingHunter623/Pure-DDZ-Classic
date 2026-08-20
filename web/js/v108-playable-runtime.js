// Pure-DDZ-Classic V1.0.8 playable runtime
// Long-term goal: offline classic landlord game for family users.

const DDZPlayableRuntime = {
  state: 'idle',
  players: [],
  history: [],

  start(players = []) {
    this.state = 'playing';
    this.players = players;
    this.history = [];
    return { state: this.state, players: this.players };
  },

  record(action) {
    this.history.push(action);
    return this.history;
  },

  finish(result) {
    this.state = 'finished';
    return result;
  }
};

window.DDZPlayableRuntime = DDZPlayableRuntime;
