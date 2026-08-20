// Pure DDZ Classic V1.0.15
// Connect real deal data with game runtime

const DDZRealDealConnector = {
  state: {
    player: [],
    aiA: [],
    aiB: [],
    bottom: []
  },

  init(cards) {
    if (!Array.isArray(cards) || cards.length !== 54) {
      return false;
    }

    this.state.player = cards.slice(0, 17);
    this.state.aiA = cards.slice(17, 34);
    this.state.aiB = cards.slice(34, 51);
    this.state.bottom = cards.slice(51, 54);

    return this.state;
  },

  getPlayerCards() {
    return this.state.player;
  },

  getAICards() {
    return {
      aiA: this.state.aiA.length,
      aiB: this.state.aiB.length
    };
  }
};

window.DDZRealDealConnector = DDZRealDealConnector;
