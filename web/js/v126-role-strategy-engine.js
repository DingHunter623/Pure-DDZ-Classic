// Pure-DDZ-Classic V1.0.26
// 地主/农民角色策略引擎基础

const DDZRoleStrategyEngine = {
  role: 'farmer',
  setRole(role) {
    this.role = role;
  },
  evaluate(state) {
    return {
      role: this.role,
      priority: this.role === 'landlord' ? 'attack' : 'cooperate',
      keepBomb: true,
      endGameMode: state && state.cards <= 5
    };
  }
};

window.DDZRoleStrategyEngine = DDZRoleStrategyEngine;
