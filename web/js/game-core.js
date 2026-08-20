// Pure DDZ Classic game core

class DDZGame {
  constructor() {
    this.players = [];
    this.deck = [];
    this.started = false;
  }

  start(players) {
    this.players = players || [];
    this.started = true;
    return '游戏开始';
  }

  getStatus() {
    return {
      started: this.started,
      players: this.players.length
    };
  }
}

window.DDZGame = DDZGame;
