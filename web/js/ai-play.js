// Pure DDZ Classic AI Player
function aiPlay(player) {
  if (!player || !player.hand || player.hand.length === 0) return [];

  // V1 simple strategy: play smallest card
  const card = player.hand.shift();
  return [card];
}
