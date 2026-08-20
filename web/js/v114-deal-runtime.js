// V1.0.14 deal runtime connector
const DDZDealRuntime = {
  players: [],
  bottomCards: [],
  init(players = []) {
    this.players = players;
    this.bottomCards = [];
    return this.players;
  },
  assign(cards) {
    return {
      player: cards.slice(0,17),
      ai1: cards.slice(17,34),
      ai2: cards.slice(34,51),
      bottom: cards.slice(51,54)
    };
  }
};
window.DDZDealRuntime = DDZDealRuntime;
