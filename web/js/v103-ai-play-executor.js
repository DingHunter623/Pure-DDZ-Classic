// Pure-DDZ-Classic V1.0.3
// AI出牌执行模块
// 负责将AI策略结果转换为实际游戏动作

class AIPlayExecutor {
  constructor(player, rules) {
    this.player = player;
    this.rules = rules;
  }

  choosePlay(lastPlay) {
    const hand = this.player.hand || [];
    if (hand.length === 0) return [];

    // 第一版策略：优先尝试单牌/对子等基础组合
    // 后续扩展完整搜索算法
    const candidates = this.findBasicCandidates(hand);

    for (const cards of candidates) {
      if (!lastPlay || this.rules.canBeat(cards, lastPlay)) {
        return cards;
      }
    }

    return [];
  }

  findBasicCandidates(hand) {
    return hand.map(card => [card]);
  }
}

window.AIPlayExecutor = AIPlayExecutor;
