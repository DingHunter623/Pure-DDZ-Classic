// Pure DDZ Classic - Table UI Renderer
function renderTable(players, bottomCards) {
  const app = document.getElementById('game-area');
  if (!app) return;
  app.innerHTML = '';

  const title = document.createElement('h2');
  title.innerText = '经典斗地主';
  app.appendChild(title);

  players.forEach((player, index) => {
    const div = document.createElement('div');
    div.className = 'player-area';
    div.innerText = index === 0 ? '我方玩家' : '电脑玩家' + index;
    app.appendChild(div);
  });

  const bottom = document.createElement('div');
  bottom.innerText = '底牌：' + (bottomCards ? bottomCards.length : 3) + '张';
  app.appendChild(bottom);
}
