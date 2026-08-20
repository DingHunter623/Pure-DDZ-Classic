// Player interaction module
const PlayManager = {
  selectedCards: [],
  select(card){
    const index=this.selectedCards.indexOf(card);
    if(index>=0){this.selectedCards.splice(index,1);}else{this.selectedCards.push(card);}
    return this.selectedCards;
  },
  clear(){this.selectedCards=[];},
  play(){
    const cards=this.selectedCards.slice();
    this.clear();
    return cards;
  }
};
