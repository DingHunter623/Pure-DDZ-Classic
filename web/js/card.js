// Pure-DDZ-Classic Card Engine
// 54 card deck generation

const SUITS = ['♠', '♥', '♣', '♦'];
const RANKS = [
  {name:'3', value:3}, {name:'4', value:4}, {name:'5', value:5},
  {name:'6', value:6}, {name:'7', value:7}, {name:'8', value:8},
  {name:'9', value:9}, {name:'10', value:10}, {name:'J', value:11},
  {name:'Q', value:12}, {name:'K', value:13}, {name:'A', value:14},
  {name:'2', value:15}
];

function createDeck(){
  const deck=[];
  SUITS.forEach(suit=>{
    RANKS.forEach(rank=>{
      deck.push({suit, name:rank.name, value:rank.value});
    });
  });
  deck.push({suit:'', name:'小王', value:16});
  deck.push({suit:'', name:'大王', value:17});
  return deck;
}

function shuffle(deck){
  return deck.sort(()=>Math.random()-0.5);
}

window.DDZCard={createDeck,shuffle};
