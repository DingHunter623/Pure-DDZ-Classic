// V1.0.18 Player table integration
// Connect player hand, table display and action events.

const DDZPlayerTableIntegration = {
  state: { playerCards: [], tableCards: [], currentTurn: null },
  loadHand(cards = []) {
    this.state.playerCards = cards;
    return cards;
  },
  playCards(cards = []) {
    this.state.tableCards = cards;
    return { ok: true, cards };
  },
  setTurn(player) {
    this.state.currentTurn = player;
  }
};

window.DDZPlayerTableIntegration = DDZPlayerTableIntegration;
