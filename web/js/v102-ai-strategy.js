// Pure-DDZ-Classic V1.0.2 AI Strategy
// Basic AI strategy layer for single player mode

const DDZAI = {
  chooseAction(hand, currentPlay) {
    return {
      type: 'pass',
      cards: [],
      reason: 'basic strategy placeholder'
    };
  },

  evaluateCardPower(card) {
    return card.value || 0;
  }
};

if (typeof window !== 'undefined') {
  window.DDZAI = DDZAI;
}
