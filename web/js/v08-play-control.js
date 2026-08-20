// Pure-DDZ-Classic Web V0.8 Play Control
// Player interaction layer

function playSelectedCards() {
  const selected = document.querySelectorAll('.ddz-card.selected');
  if (selected.length === 0) {
    return { success:false, message:'请选择要出的牌' };
  }

  return {
    success:true,
    cards:Array.from(selected).map(x => x.innerText)
  };
}
