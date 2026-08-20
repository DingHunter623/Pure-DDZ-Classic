// Pure-DDZ-Classic V1.0.4
// Card combination analyzer foundation

const DDZComboAnalyzer = {
  analyze(cards) {
    const result = { type: 'unknown', power: 0, cards: cards || [] };
    if (!cards || cards.length === 0) return result;
    const count = {};
    cards.forEach(c => count[c] = (count[c] || 0) + 1);
    const values = Object.values(count).sort((a,b)=>b-a);
    if (cards.length === 2 && values.includes(1) && values.includes(1)) {
      result.type = 'pair_or_bomb_check';
    }
    if (cards.length === 2 && values[0] === 2) {
      result.type = 'pair';
    }
    if (cards.length === 4 && values[0] === 4) {
      result.type = 'bomb';
    }
    return result;
  },
  canBeat(current, previous) {
    if (!previous || previous.type === 'unknown') return true;
    if (current.type === 'bomb' && previous.type !== 'bomb') return true;
    return current.power > previous.power;
  }
};

window.DDZComboAnalyzer = DDZComboAnalyzer;
