// Pure DDZ Classic V1.0.11
// Card play controller bridge for UI interaction

window.DDZCardPlayController = {
  selectedCards: [],
  select(card) {
    const index = this.selectedCards.indexOf(card);
    if (index >= 0) {
      this.selectedCards.splice(index, 1);
    } else {
      this.selectedCards.push(card);
    }
    return this.selectedCards;
  },
  clear() {
    this.selectedCards = [];
  },
  getSelected() {
    return this.selectedCards;
  }
};
