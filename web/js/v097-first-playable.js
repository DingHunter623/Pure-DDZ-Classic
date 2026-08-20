// Pure-DDZ-Classic Web V0.9.7
// First playable integration layer

const DDZPlayable = {
  state: 'ready',
  start() {
    this.state = 'playing';
    console.log('Pure DDZ Classic started');
  },
  reset() {
    this.state = 'ready';
    console.log('Game reset');
  }
};

window.DDZPlayable = DDZPlayable;
