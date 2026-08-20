// Pure-DDZ-Classic Web V0.4
// First playable flow controller

const DDZGame = {
  players: [],
  bottomCards: [],
  started: false,

  start(players) {
    this.players = players || [];
    this.started = true;
    return '游戏开始';
  },

  assignLandlord(index) {
    if (!this.players[index]) return false;
    this.players[index].role = '地主';
    this.bottomCards = this.bottomCards.concat([]);
    return true;
  },

  getStatus() {
    return {
      started: this.started,
      players: this.players.length,
      bottomCards: this.bottomCards.length
    };
  }
};

window.DDZGame = DDZGame;
