// Pure-DDZ-Classic rendering layer

function renderCards(container, cards) {
  if (!container) return;

  container.innerHTML = '';

  cards.forEach(card => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerText = card.name || `${card.rank}`;
    container.appendChild(el);
  });
}

window.CardRender = {
  renderCards
};
