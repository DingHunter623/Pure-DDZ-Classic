// Pure-DDZ-Classic Web V0.9
// Score and win/loss calculation foundation

function calculateResult(role, winner) {
  return {
    role: role,
    winner: winner,
    multiplier: 1
  };
}

window.calculateResult = calculateResult;
