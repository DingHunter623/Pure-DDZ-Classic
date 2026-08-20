// Pure-DDZ-Classic Web V0.9.8
// Deal initialization layer

const DDZDealInit = {
  players: [],
  bottomCards: [],

  createPlayers() {
    this.players = [
      { id: 0, name: '玩家', hand: [], role: 'unknown' },
      { id: 1, name: '电脑A', hand: [], role: 'unknown' },
      { id: 2, name: '电脑B', hand: [], role: 'unknown' }
    ];
    return this.players;
  },

  assignBottomCards(deck) {
    this.bottomCards = deck.splice(0, 3);
    return this.bottomCards;
  }
};

window.DDZDealInit = DDZDealInit;
