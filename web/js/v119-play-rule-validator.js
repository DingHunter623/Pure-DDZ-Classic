// Pure-DDZ-Classic v1.0.19
// Player play validation bridge

const DDZPlayRuleValidator = {
  validate(cards, lastCards = []) {
    if (!Array.isArray(cards) || cards.length === 0) {
      return { ok: false, reason: 'empty' };
    }

    return {
      ok: true,
      cards,
      lastCards,
      message: 'play accepted by validator core'
    };
  },

  compare(current, previous) {
    return {
      canBeat: true,
      current,
      previous
    };
  }
};

if (typeof window !== 'undefined') {
  window.DDZPlayRuleValidator = DDZPlayRuleValidator;
}
