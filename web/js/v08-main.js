// Pure DDZ Classic V0.8 Main Controller
// Integrates UI and game modules

const DDZGame = {
  started: false,
  start() {
    this.started = true;
    const info = document.getElementById('game-info');
    if (info) info.innerText = '斗地主开始，正在发牌...';
    if (window.initDealFlow) {
      window.initDealFlow();
    }
  },
  message(text) {
    const info = document.getElementById('game-info');
    if (info) info.innerText = text;
  }
};

window.DDZGame = DDZGame;
