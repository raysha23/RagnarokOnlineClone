// ===================================================================
// RAGNAROK STAT SYSTEM - CLEAN FINAL VERSION (VALIDATED)
// ===================================================================

// ===================================================================
// FORMULAS
// ===================================================================

function getPointsForLevel(level) {
  if (level <= 4) return 3;
  if (level >= 95) return 22;
  return Math.floor((level - 1) / 5) + 3;
}

function getTotalStatPointsForLevel(level) {
  const STARTING_STATUS_POINTS = 60;

  if (level === 1) return STARTING_STATUS_POINTS;

  let total = STARTING_STATUS_POINTS;
  for (let i = 2; i <= level; i++) {
    total += getPointsForLevel(i);
  }
  return total;
}

function getStatIncreaseCost(currentStatValue) {
  // Base stats are always at least 1
  return Math.min(Math.floor((currentStatValue - 1) / 10) + 2, 11);
}

function getTotalCostToReachStat(currentStat, targetStat) {
  let totalCost = 0;
  for (let i = currentStat; i < targetStat; i++) {
    totalCost += getStatIncreaseCost(i);
  }
  return totalCost;
}

// ===================================================================
// CHARACTER STATE
// ===================================================================

const character = {
  baseLevel: 1,
  stats: {
    str: 1,
    agi: 1,
    vit: 1,
    int: 1,
    dex: 1,
    luk: 1,
  },
  availablePoints: 0,
};

// ===================================================================
// DOM ELEMENTS
// ===================================================================

let elements = {};

function initializeElements() {
  elements.attackInput = document.querySelector(".atk-value");

  elements.magicAttackInput = document.querySelector(
    ".status-columns .column:first-child .table-row:nth-child(2) input",
  );

  elements.critInput = document.querySelector(
    ".status-columns .column:first-child .table-row:nth-child(4) input",
  );

  // Defense - second input in FIRST row
  elements.defenseInput = document.querySelectorAll(
    ".status-columns .column:nth-child(2) .table-row:nth-child(1) input"
  )[1];

  // Magic Defense - second input in SECOND row
  elements.magicDefenseInput = document.querySelectorAll(
    ".status-columns .column:nth-child(2) .table-row:nth-child(2) input"
  )[1];

  elements.attackSpeedInput = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(4) input",
  );

  elements.levelInput = document.querySelector(".lvl-value-input");
  elements.statusPointInput = document.querySelector(".status-value");

  elements.hitRateInput = document.querySelector(
    ".status-columns .column:nth-child(1) .table-row:nth-child(3) input",
  );

  elements.fleeRateInput = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(3) input",
  );

  elements.statRows = {
    str: document.querySelectorAll(".column:first-child .table-row")[0],
    agi: document.querySelectorAll(".column:first-child .table-row")[1],
    vit: document.querySelectorAll(".column:first-child .table-row")[2],
    int: document.querySelectorAll(".column:first-child .table-row")[3],
    dex: document.querySelectorAll(".column:first-child .table-row")[4],
    luk: document.querySelectorAll(".column:first-child .table-row")[5],
  };

  elements.ptsReqDisplays = document.querySelectorAll(
    ".column:nth-child(3) .table-row .value",
  );
}

// ===================================================================
// STAT MANAGEMENT
// ===================================================================

function increaseStat(statName) {
  const currentValue = character.stats[statName];
  const cost = getStatIncreaseCost(currentValue);

  if (
    character.availablePoints >= cost &&
    currentValue < 99 // Max base stat cap
  ) {
    character.stats[statName]++;
    character.availablePoints -= cost;
    updateUI();
  }
}

function decreaseStat(statName) {
  const currentValue = character.stats[statName];

  // Minimum base stat is 1
  if (currentValue > 1) {
    const refund = getStatIncreaseCost(currentValue - 1);
    character.stats[statName]--;
    character.availablePoints += refund;
    updateUI();
  }
}

function updateLevel(newLevel) {
  newLevel = Math.max(1, Math.min(99, parseInt(newLevel) || 1));
  character.baseLevel = newLevel;

  const totalPoints = getTotalStatPointsForLevel(newLevel);

  const spentPoints = Object.keys(character.stats).reduce((sum, stat) => {
    return sum + getTotalCostToReachStat(1, character.stats[stat]);
  }, 0);

  character.availablePoints = totalPoints - spentPoints;

  if (character.availablePoints < 0) {
    character.availablePoints = 0;
  }

  updateUI();
}

// ===================================================================
// UI UPDATE
// ===================================================================

function updateUI() {
  const combatStats = calculateCombatStats(character);

  if (elements.attackInput) {
    elements.attackInput.value = combatStats.attack;
  }

  if (elements.magicAttackInput) {
    elements.magicAttackInput.value = combatStats.magicAttack;
  }

  if (elements.critInput) {
    elements.critInput.value = combatStats.crit;
  }

  if (elements.defenseInput) {
    elements.defenseInput.value = combatStats.defense;
  }

  if (elements.magicDefenseInput) {
    elements.magicDefenseInput.value = combatStats.magicDefense;
  }

  if (elements.attackSpeedInput) {
    elements.attackSpeedInput.value = combatStats.attackSpeed;
  }

  if (elements.hitRateInput) {
    elements.hitRateInput.value = combatStats.hit;
  }

  if (elements.fleeRateInput) {
    elements.fleeRateInput.value = combatStats.flee;
  }

  if (elements.levelInput) {
    elements.levelInput.value = character.baseLevel;
  }

  if (elements.statusPointInput) {
    elements.statusPointInput.value = character.availablePoints;
  }

  const statOrder = ["str", "agi", "vit", "int", "dex", "luk"];

  statOrder.forEach((statName, index) => {
    const row = elements.statRows[statName];

    // Safety validation (never allow below 1)
    if (character.stats[statName] < 1) {
      character.stats[statName] = 1;
    }

    if (row) {
      const input = row.querySelector(".stat-input");
      if (input) {
        input.value = character.stats[statName];
      }
    }

    if (elements.ptsReqDisplays[index]) {
      const cost = getStatIncreaseCost(character.stats[statName]);
      elements.ptsReqDisplays[index].textContent = cost;
    }
  });
}

// ===================================================================
// EVENT LISTENERS
// ===================================================================

function attachEventListeners() {
  const statOrder = ["str", "agi", "vit", "int", "dex", "luk"];

  statOrder.forEach((statName) => {
    const row = elements.statRows[statName];

    if (row) {
      const plusBtn = row.querySelector(".plus");
      const minusBtn = row.querySelector(".minus");

      if (plusBtn) {
        plusBtn.addEventListener("click", () => increaseStat(statName));
      }

      if (minusBtn) {
        minusBtn.addEventListener("click", () => decreaseStat(statName));
      }
    }
  });

  if (elements.levelInput) {
    elements.levelInput.addEventListener("input", (e) => {
      let raw = e.target.value.replace(/\D/g, "");

      if (raw === "") {
        e.target.value = "";
        return;
      }

      let value = parseInt(raw);
      if (value > 99) value = 99;

      e.target.value = value;
      updateLevel(value);
    });

    elements.levelInput.addEventListener("blur", (e) => {
      let value = parseInt(e.target.value);

      if (isNaN(value) || value < 1) value = 1;
      value = Math.max(1, Math.min(99, value));

      e.target.value = value;
      updateLevel(value);
    });
  }
}

// ===================================================================
// INITIALIZATION
// ===================================================================

function initialize() {
  initializeElements();
  updateLevel(1);
  attachEventListeners();

  console.log("🎮 Ragnarok Stat System Initialized (Validated)!");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// ===================================================================
// EXPORT FOR DEBUGGING
// ===================================================================

window.RagnarokStats = {
  character,
  increaseStat,
  decreaseStat,
  updateLevel,
  getPointsForLevel,
  getStatIncreaseCost,
  getTotalStatPointsForLevel,
};
