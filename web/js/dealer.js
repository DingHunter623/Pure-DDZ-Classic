// Pure-DDZ-Classic dealer engine

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealCards(deck) {
  const players = [[], [], []];
  const bottom = [];

  deck.forEach((card, index) => {
    if (index < 51) {
      players[index % 3].push(card);
    } else {
      bottom.push(card);
    }
  });

  return {
    players,
    bottom
  };
}

window.Dealer = {
  shuffleDeck,
  dealCards
};
