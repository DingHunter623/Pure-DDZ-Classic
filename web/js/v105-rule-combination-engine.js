// Pure-DDZ-Classic V1.0.5
// Extended Dou Dizhu combination detection

const DDZCombinationEngine = {
  analyze(cards) {
    if (!cards || cards.length === 0) return { type: 'NONE' };

    const count = {};
    cards.forEach(c => count[c] = (count[c] || 0) + 1);
    const values = Object.values(count).sort((a,b)=>b-a);

    if (cards.length === 2 && cards.includes('RJ') && cards.includes('BJ')) {
      return { type: 'ROCKET' };
    }
    if (values[0] === 4) return { type: 'BOMB' };
    if (values[0] === 3 && cards.length === 3) return { type: 'TRIPLE' };
    if (values[0] === 2 && cards.length === 2) return { type: 'PAIR' };
    if (cards.length === 1) return { type: 'SINGLE' };

    return { type: 'UNKNOWN' };
  }
};

window.DDZCombinationEngine = DDZCombinationEngine;
