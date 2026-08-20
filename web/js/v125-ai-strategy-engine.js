// Pure-DDZ-Classic V1.0.25
// AI strategy engine foundation

class DDZStrategyEngine {
  constructor(){
    this.level = 'normal';
  }

  evaluate(play, context={}){
    let score = 0;
    if(play && play.type === 'bomb') score += 20;
    if(context.endGame) score += 10;
    return score;
  }

  choose(candidates=[], context={}){
    if(!candidates.length) return null;
    return candidates.sort((a,b)=>this.evaluate(b,context)-this.evaluate(a,context))[0];
  }
}

window.DDZStrategyEngine = DDZStrategyEngine;
