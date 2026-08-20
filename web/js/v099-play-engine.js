// Pure-DDZ-Classic Web
// V0.9.9 Play Engine Foundation

const PlayEngine = {
  currentPlayer: 0,
  lastCards: [],
  history: [],

  play(cards, playerId) {
    this.lastCards = cards || [];
    this.history.push({ playerId, cards });
    return true;
  },

  pass(playerId) {
    this.history.push({ playerId, action: 'pass' });
    return true;
  },

  nextTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % 3;
    return this.currentPlayer;
  },

  reset() {
    this.currentPlayer = 0;
    this.lastCards = [];
    this.history = [];
  }
};

window.PlayEngine = PlayEngine;
