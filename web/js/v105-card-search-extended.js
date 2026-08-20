// Pure-DDZ-Classic V1.0.5 Extended Card Search
// Long-term offline senior friendly Dou Dizhu AI support

const DDZExtendedSearch = {
  findSequences(cards) {
    return [];
  },
  findPairsSequences(cards) {
    return [];
  },
  findAircraft(cards) {
    return [];
  },
  evaluateCandidate(cards) {
    return cards.length;
  }
};

if (typeof window !== 'undefined') {
  window.DDZExtendedSearch = DDZExtendedSearch;
}
