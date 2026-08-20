// Pure-DDZ-Classic V1.0 rules engine
// Classic Chinese Dou Dizhu rule recognition foundation

function analyzeCards(cards) {
  if (!cards || cards.length === 0) return {type:'empty'};

  const count = {};
  cards.forEach(c => {
    count[c.value] = (count[c.value] || 0) + 1;
  });

  const values = Object.keys(count).map(Number).sort((a,b)=>a-b);
  const counts = Object.values(count).sort((a,b)=>b-a);

  if (cards.length === 2 && values.includes(16) && values.includes(17)) {
    return {type:'rocket', level:999};
  }

  if (counts[0] === 4 && cards.length === 4) {
    return {type:'bomb', level:values[0]};
  }

  if (counts[0] === 2 && cards.length === 2) {
    return {type:'pair', level:values[0]};
  }

  if (counts[0] === 1 && cards.length === 1) {
    return {type:'single', level:values[0]};
  }

  return {type:'unknown'};
}

function canBeat(current, next) {
  if (!next || next.type === 'unknown') return false;
  if (!current || current.type === 'empty') return true;
  if (next.type === 'rocket') return true;
  if (current.type !== next.type) {
    return next.type === 'bomb';
  }
  return next.level > current.level;
}

window.DDZRules = { analyzeCards, canBeat };
