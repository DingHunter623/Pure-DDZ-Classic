// Pure-DDZ-Classic V1.0.5 AI combination search foundation
// Offline senior friendly Dou Dizhu

const DDZSearch = {
  findCandidates(hand) {
    const groups = [];
    if (!Array.isArray(hand)) return groups;

    const count = {};
    hand.forEach(card => {
      count[card.rank] = (count[card.rank] || 0) + 1;
    });

    Object.keys(count).forEach(rank => {
      if (count[rank] >= 1) {
        groups.push({ type: 'single', rank: Number(rank), cards: [rank] });
      }
      if (count[rank] >= 2) {
        groups.push({ type: 'pair', rank: Number(rank), cards: [rank, rank] });
      }
      if (count[rank] >= 4) {
        groups.push({ type: 'bomb', rank: Number(rank), cards: [rank, rank, rank, rank] });
      }
    });

    return groups;
  },

  choosePlay(hand, lastPlay) {
    const candidates = this.findCandidates(hand);
    return candidates.find(play => !lastPlay || play.rank > lastPlay.rank) || null;
  }
};

window.DDZSearch = DDZSearch;
