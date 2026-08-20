// Player model for Pure-DDZ-Classic

class Player {
  constructor(name, type='AI') {
    this.name = name;
    this.type = type;
    this.hand = [];
    this.role = 'farmer';
  }

  receiveCards(cards){
    this.hand = cards;
  }
}

window.DDZPlayer={Player};
