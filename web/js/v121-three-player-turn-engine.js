// V1.0.21 Three player turn engine
// Offline single player mode controller

const DDZThreePlayerTurnEngine = {
  players: ['player', 'ai_left', 'ai_right'],
  currentIndex: 0,
  history: [],

  currentPlayer() {
    return this.players[this.currentIndex];
  },

  nextTurn() {
    this.currentIndex = (this.currentIndex + 1) % this.players.length;
    return this.currentPlayer();
  },

  recordAction(player, action) {
    this.history.push({ player, action, time: Date.now() });
  },

  reset() {
    this.currentIndex = 0;
    this.history = [];
  }
};

window.DDZThreePlayerTurnEngine = DDZThreePlayerTurnEngine;
