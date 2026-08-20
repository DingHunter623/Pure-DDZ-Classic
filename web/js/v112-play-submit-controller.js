// V1.0.12 Player play submit controller
// Connects selected cards with rules and game loop.

const DDZPlaySubmitController = {
  submit(selectedCards, context = {}) {
    if (!Array.isArray(selectedCards) || selectedCards.length === 0) {
      return { ok: false, message: '请选择牌' };
    }

    return {
      ok: true,
      cards: selectedCards,
      player: context.player || 'human',
      next: 'ai_turn'
    };
  }
};

window.DDZPlaySubmitController = DDZPlaySubmitController;
