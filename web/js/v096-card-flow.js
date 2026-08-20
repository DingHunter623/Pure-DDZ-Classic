// Pure-DDZ-Classic Web V0.9.6
// Card flow integration placeholder

function startCardFlow(game){
  if(!game){
    return false;
  }
  game.status = 'dealing';
  return true;
}

export { startCardFlow };
