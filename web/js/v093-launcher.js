// Pure DDZ Classic V0.9.3 launcher
// Connects browser UI with game runtime

window.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const start = document.getElementById('start');

  if (start) {
    start.addEventListener('click', () => {
      status.innerText = '正在发牌，准备开始斗地主...';
      if (window.PureDDZRuntime && window.PureDDZRuntime.start) {
        window.PureDDZRuntime.start();
      }
    });
  }
});
