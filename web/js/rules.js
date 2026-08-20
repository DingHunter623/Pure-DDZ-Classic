// Basic Dou Dizhu rule detection
function checkCards(cards){
  if(!cards || cards.length===0) return false;
  if(cards.length===1) return true;
  const values=cards.map(c=>c.value).sort((a,b)=>a-b);
  const same=values.every(v=>v===values[0]);
  if(same) return true;
  if(cards.length>=5){
    for(let i=1;i<values.length;i++){
      if(values[i]!==values[i-1]+1) return false;
    }
    return true;
  }
  return false;
}
