// Pure-DDZ-Classic Web V0.9 integration layer
// Connects game modules for the first playable flow.

const DDZApp = {
  started: false,
  start() {
    this.started = true;
    console.log('Pure-DDZ-Classic started');
    if (typeof updateGameMessage === 'function') {
      updateGameMessage('游戏开始，正在发牌...');
    }
  },
  reset() {
    this.started = false;
  }
};

window.DDZApp = DDZApp;
