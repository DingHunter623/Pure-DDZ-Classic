// Pure-DDZ-Classic Web V0.7
// 斗地主桌面UI控制模块

const DDZUI = {
  init(){
    console.log('斗地主桌面UI初始化');
  },
  showMessage(msg){
    const el = document.getElementById('game-message');
    if(el){ el.innerText = msg; }
  },
  renderPlayerCards(cards){
    const area = document.getElementById('player-cards');
    if(!area) return;
    area.innerHTML = '';
    cards.forEach(card=>{
      const item=document.createElement('button');
      item.className='card';
      item.innerText=card;
      area.appendChild(item);
    });
  }
};

window.DDZUI = DDZUI;
