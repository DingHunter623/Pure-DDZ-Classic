// Pure-DDZ-Classic Web V0.9.1 playable layer
// Browser MVP integration entry

const DDZPlayable = {
  state: 'ready',
  start() {
    this.state = 'playing';
    console.log('Pure DDZ Classic started');
  },
  reset() {
    this.state = 'ready';
  }
};

window.DDZPlayable = DDZPlayable;
