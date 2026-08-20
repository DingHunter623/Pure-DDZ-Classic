// Pure-DDZ-Classic V0.7 Game Controller

class DDZController {
  constructor(){
    this.started=false;
    this.players=[];
  }

  start(){
    this.started=true;
    if(window.DDZUI){
      DDZUI.showMessage('斗地主开始');
    }
  }

  play(){
    if(!this.started) return;
    if(window.DDZUI){
      DDZUI.showMessage('等待出牌');
    }
  }
}

window.ddzController = new DDZController();
