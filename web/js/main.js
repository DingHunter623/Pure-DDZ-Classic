// Main entry for Pure-DDZ-Classic Web

function startClassicDDZ() {
  if (window.DDZGame) {
    DDZGame.start([]);
    console.log('斗地主初始化完成');
  }
}

window.startClassicDDZ = startClassicDDZ;
