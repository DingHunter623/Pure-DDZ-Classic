// V1.0.16 Player hand renderer
// Large card display optimized for senior users

const DDZHandRenderer = {
  sort(cards) {
    return [...cards].sort((a,b)=>b.value-a.value);
  },
  render(cards, containerId='player-hand') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML='';
    this.sort(cards).forEach(card=>{
      const el=document.createElement('button');
      el.className='ddz-card large-card';
      el.textContent=card.name || card.value;
      container.appendChild(el);
    });
  }
};

window.DDZHandRenderer = DDZHandRenderer;
