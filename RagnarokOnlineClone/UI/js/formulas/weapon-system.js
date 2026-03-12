const weaponData = {
  hand: { aspdPenalty: 0, weight: 0 },

  dagger: { aspdPenalty: -5, weight: 400 },

  sword: { aspdPenalty: -8, weight: 800 },

  "2hsword": { aspdPenalty: -12, weight: 1200 },

  bow: { aspdPenalty: -10, weight: 600 },

  staff: { aspdPenalty: -7, weight: 500 },
};

const weaponSelect = document.getElementById("weapon-select");

weaponSelect.addEventListener("change", () => {
  calculateCombatStats();
});
