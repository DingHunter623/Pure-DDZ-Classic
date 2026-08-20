// Pure-DDZ-Classic Web V0.9.4
// Game loop controller placeholder for playable integration.

const DDZGameLoop = {
  running: false,
  start() {
    this.running = true;
    console.log('Dou Dizhu game started');
  },
  reset() {
    this.running = false;
    console.log('Dou Dizhu game reset');
  }
};

window.DDZGameLoop = DDZGameLoop;
