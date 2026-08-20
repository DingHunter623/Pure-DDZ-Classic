// V1.0.17 斗地主桌面显示控制器
// 负责牌桌区域、玩家信息、回合状态显示

const DDZTableViewController = {
  state: {
    currentPlayer: null,
    lastPlay: [],
    players: []
  },

  updateTurn(player) {
    this.state.currentPlayer = player;
    return player;
  },

  showPlay(cards) {
    this.state.lastPlay = cards || [];
    return this.state.lastPlay;
  },

  updatePlayers(players) {
    this.state.players = players || [];
    return this.state.players;
  }
};

window.DDZTableViewController = DDZTableViewController;
