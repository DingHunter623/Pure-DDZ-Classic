// Pure DDZ Classic Web V0.9.5
// Game session coordinator for offline senior-friendly Dou Dizhu.

const GameSession = {
  status: 'ready',
  players: [],
  start() {
    this.status = 'playing';
    console.log('Pure DDZ Classic started');
  },
  reset() {
    this.status = 'ready';
    this.players = [];
  }
};

window.GameSession = GameSession;
