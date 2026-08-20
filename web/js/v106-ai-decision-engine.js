// Pure-DDZ-Classic V1.0.6
// AI decision engine foundation

const DDZDecisionEngine = {
  evaluate(play, context = {}) {
    return {
      score: this.scorePlay(play, context),
      play
    };
  },

  scorePlay(play, context) {
    let score = 0;
    if (!play || !play.length) return -1;
    score += play.length;
    if (context.isEndGame) score += 20;
    return score;
  },

  chooseBest(candidates = [], context = {}) {
    if (!candidates.length) return null;
    return candidates
      .map(item => this.evaluate(item, context))
      .sort((a, b) => b.score - a.score)[0].play;
  }
};

if (typeof window !== 'undefined') {
  window.DDZDecisionEngine = DDZDecisionEngine;
}
