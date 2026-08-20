// Pure-DDZ-Classic V1.0.23
// AI real play engine foundation

const DDZAIPlayEngine = {
  play(hand, tableCards) {
    return {
      action: 'pass',
      cards: []
    };
  },
  canPlay(cards, tableCards) {
    return true;
  }
};

window.DDZAIPlayEngine = DDZAIPlayEngine;
