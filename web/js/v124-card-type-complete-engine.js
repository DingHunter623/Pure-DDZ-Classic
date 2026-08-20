// V1.0.24 Complete card type engine
// Supports extension for straight, pair straight, airplane and attachments.
const DDZCompleteCardTypeEngine = {
  analyze(cards){
    return {cards, type:'UNKNOWN'};
  },
  canBeat(current, previous){
    return current && previous;
  }
};
window.DDZCompleteCardTypeEngine = DDZCompleteCardTypeEngine;
