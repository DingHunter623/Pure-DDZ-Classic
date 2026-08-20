// Pure-DDZ-Classic Web V0.8 Card Renderer
// Long-term goal: large card display for senior users.

function renderCards(containerId, cards) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  cards.forEach(card => {
    const el = document.createElement('button');
    el.className = 'ddz-card';
    el.innerText = card.name || card.value || '牌';
    el.onclick = () => el.classList.toggle('selected');
    container.appendChild(el);
  });
}
