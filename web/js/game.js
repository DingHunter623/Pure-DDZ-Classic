const game = {
    started:false,
    cards:[],
    start(){
        this.started=true;
        document.getElementById('status').innerText='游戏开始，正在发牌...';
    }
};

document.getElementById('start').onclick=()=>game.start();
