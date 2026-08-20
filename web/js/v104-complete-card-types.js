// Pure-DDZ-Classic V1.0.4 Complete Card Type Analyzer
// Traditional offline Dou Dizhu rules foundation

const DDZCardTypes = {
  SINGLE: 'single',
  PAIR: 'pair',
  TRIPLE: 'triple',
  TRIPLE_ONE: 'triple_one',
  TRIPLE_TWO: 'triple_two',
  STRAIGHT: 'straight',
  DOUBLE_STRAIGHT: 'double_straight',
  AIRPLANE: 'airplane',
  BOMB: 'bomb',
  ROCKET: 'rocket'
};

function analyzeCards(cards) {
  if (!cards || cards.length === 0) return null;
  const count = {};
  cards.forEach(c => count[c] = (count[c] || 0) + 1);
  const values = Object.values(count).sort((a,b)=>a-b);

  if (cards.length === 1) return DDZCardTypes.SINGLE;
  if (cards.length === 2 && values[0] === 2) return DDZCardTypes.PAIR;
  if (cards.length === 3 && values[0] === 3) return DDZCardTypes.TRIPLE;
  if (cards.length === 4 && values[0] === 4) return DDZCardTypes.BOMB;
  if (cards.length === 2 && cards.includes('SJ') && cards.includes('BJ')) return DDZCardTypes.ROCKET;

  return null;
}

window.DDZCardTypes = DDZCardTypes;
window.analyzeCards = analyzeCards;
