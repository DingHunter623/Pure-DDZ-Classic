// Pure-DDZ-Classic Web V0.9
// Round engine: player turn, AI turn and round state management

class RoundEngine {
  constructor(players) {
    this.players = players || [];
    this.currentPlayer = 0;
    this.lastPlay = null;
  }

  nextTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    return this.players[this.currentPlayer];
  }

  play(player, cards) {
    this.lastPlay = { player, cards };
    return true;
  }

  pass(player) {
    return { player, action: 'pass' };
  }
}

window.RoundEngine = RoundEngine;
