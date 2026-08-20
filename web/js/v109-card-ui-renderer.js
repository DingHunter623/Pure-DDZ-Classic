// Pure-DDZ-Classic V1.0.9
// Large card UI renderer for senior-friendly mode

const DDZCardUIRenderer = {
  renderHand(cards, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    cards.forEach(card => {
      const el = document.createElement('button');
      el.className = 'ddz-card large-card';
      el.textContent = card.display || card.name || card;
      el.onclick = () => el.classList.toggle('selected');
      container.appendChild(el);
    });
  },

  getSelected(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return [...container.querySelectorAll('.selected')].map(e => e.textContent);
  }
};

window.DDZCardUIRenderer = DDZCardUIRenderer;
