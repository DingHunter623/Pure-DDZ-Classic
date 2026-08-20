// Pure-DDZ-Classic V1.0.30 Beta Game Integrator
// Integrates deal, rules, turns, AI and UI modules.

const DDZBetaGameIntegrator = {
  state: 'ready',
  start(){
    this.state = 'playing';
    return {state:this.state, message:'game started'};
  },
  finish(result){
    this.state = 'finished';
    return result;
  }
};

window.DDZBetaGameIntegrator = DDZBetaGameIntegrator;
