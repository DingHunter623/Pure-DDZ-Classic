// Pure DDZ Classic Web V0.9.2 runtime integration
// Browser playable runtime entry

const DDZRuntime = {
  status: 'ready',
  players: [],
  start() {
    this.status = 'playing';
    console.log('Pure DDZ Classic started');
  },
  reset() {
    this.status = 'ready';
    console.log('Game reset');
  }
};

window.DDZRuntime = DDZRuntime;
