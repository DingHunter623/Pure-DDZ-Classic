// V1.0.32 Final Table UI Controller
// Long-term goal: integrate desktop playable table experience.

const DDZFinalTableUI = {
  state: {
    started: false,
    currentPlayer: 'player',
    message: '准备开始游戏'
  },

  start() {
    this.state.started = true;
    this.state.message = '游戏开始';
    return this.state;
  },

  updateMessage(message) {
    this.state.message = message;
    return message;
  },

  getState() {
    return this.state;
  }
};

window.DDZFinalTableUI = DDZFinalTableUI;
