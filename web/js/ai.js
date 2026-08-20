// Pure DDZ Classic AI framework

class DDZAI {
  constructor(player) {
    this.player = player;
  }

  think(hand, lastPlay = null) {
    // V0.3 basic strategy placeholder
    // Future: card type analysis and optimal play
    if (!hand || hand.length === 0) return [];
    return hand.slice(0, 1);
  }
}

window.DDZAI = DDZAI;
