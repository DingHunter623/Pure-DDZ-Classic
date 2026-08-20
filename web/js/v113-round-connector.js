// Pure DDZ Classic V1.0.13
// Connect deal data, player turn and round actions

const DDZRoundConnector = {
  state: {
    players: [],
    currentPlayer: 0,
    history: []
  },
  start(players = []) {
    this.state.players = players;
    this.state.currentPlayer = 0;
    this.state.history = [];
    return this.state;
  },
  nextTurn() {
    this.state.currentPlayer = (this.state.currentPlayer + 1) % this.state.players.length;
    return this.state.currentPlayer;
  },
  record(action) {
    this.state.history.push(action);
  }
};

window.DDZRoundConnector = DDZRoundConnector;
