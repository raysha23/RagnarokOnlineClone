// ===================================================================
// RAGNAROK STAT SYSTEM - PROFESSIONAL VERSION
// Auto-disable buttons instead of alert()
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
  const STARTING_STATUS_POINTS = 48;

  if (level === 1) return STARTING_STATUS_POINTS;

  let total = STARTING_STATUS_POINTS;
  for (let i = 2; i <= level; i++) {
    total += getPointsForLevel(i);
  }
  return total;
}

function getStatIncreaseCost(currentStatValue) {
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
  elements.MinmagicAttackInput = document.querySelector(
    ".status-columns .column:first-child .table-row:nth-child(2) input",
  );
  elements.MaxmagicAttackInput = document.querySelector(
    ".status-columns .column:first-child .table-row:nth-child(2) input:last-child",
  );
  elements.critInput = document.querySelector(
    ".status-columns .column:first-child .table-row:nth-child(4) input",
  );

  elements.defenseInput = document.querySelectorAll(
    ".status-columns .column:nth-child(2) .table-row:nth-child(1) input",
  )[1];
  elements.magicDefenseInput = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(2) input:last-of-type",
  );

  elements.attackSpeedInput = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(4) input",
  );

  elements.levelInput = document.querySelector(".lvl-value-input");
  elements.statusPointInput = document.querySelector(".status-value");

  elements.hitRateInput = document.querySelector(
    ".status-columns .column:nth-child(1) .table-row:nth-child(3) input",
  );

  const fleeRow = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(3)",
  );

  if (fleeRow) {
    const inputs = fleeRow.querySelectorAll("input");
    elements.fleeBaseInput = inputs[0]; // first input
    elements.fleeLukInput = inputs[1]; // second input (includes LUK)
  }

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
// CORE LOGIC
// ===================================================================

function calculateRemainingPointsWithChange(statName, newValue) {
  const totalPoints = getTotalStatPointsForLevel(character.baseLevel);

  const spentPoints = Object.keys(character.stats).reduce((sum, stat) => {
    const value = stat === statName ? newValue : character.stats[stat];
    return sum + getTotalCostToReachStat(1, value);
  }, 0);

  return totalPoints - spentPoints;
}

function trySetStat(statName, newValue) {
  newValue = Math.max(1, Math.min(99, parseInt(newValue) || 1));

  const remaining = calculateRemainingPointsWithChange(statName, newValue);

  if (remaining < 0) return;

  character.stats[statName] = newValue;
  character.availablePoints = remaining;

  updateUI();
}

// ===================================================================
// LEVEL UPDATE
// ===================================================================

function updateLevel(newLevel) {
  newLevel = Math.max(1, Math.min(99, parseInt(newLevel) || 1));
  character.baseLevel = newLevel;

  const totalPoints = getTotalStatPointsForLevel(newLevel);

  const spentPoints = Object.values(character.stats).reduce((sum, value) => {
    return sum + getTotalCostToReachStat(1, value);
  }, 0);

  character.availablePoints = Math.max(0, totalPoints - spentPoints);

  updateUI();
}

// ===================================================================
// UI UPDATE
// ===================================================================

function updateUI() {
  // Use the external combat-system.js formulas
  const combatStats = calculateCombatStats(character);

  // ================= STAT VALUES =================
  elements.attackInput.value = combatStats.attack;
  elements.MinmagicAttackInput.value = combatStats.matkMin;
  elements.MaxmagicAttackInput.value = combatStats.matkMax;
  elements.critInput.value = combatStats.crit;
  elements.defenseInput.value = combatStats.defense;
  elements.magicDefenseInput.value = combatStats.mdefBase; // or mdefMax, they are the same in this approximation
  elements.attackSpeedInput.value = combatStats.attackSpeed;
  elements.hitRateInput.value = combatStats.hit;

  // ================= FLEE RATE =================
  // Base flee (level + AGI), minimum 1
  if (elements.fleeBaseInput) {
    elements.fleeBaseInput.value = Math.max(
      1,
      character.baseLevel + character.stats.agi,
    );
  }
  // Flee bonus from LUK (starts at 1, +1 per 10 LUK)
  if (elements.fleeLukInput) {
    const fleeLukBonus = 1 + Math.floor(character.stats.luk / 10);
    elements.fleeLukInput.value = fleeLukBonus;
  }

  // ================= LEVEL & STATUS POINT =================
  elements.levelInput.value = character.baseLevel;
  elements.statusPointInput.value = character.availablePoints;

  // ================= STATS ROWS =================
  const statOrder = ["str", "agi", "vit", "int", "dex", "luk"];
  statOrder.forEach((statName, index) => {
    const row = elements.statRows[statName];
    const input = row.querySelector(".stat-input");
    const plusBtn = row.querySelector(".stat-btn.plus");
    const minusBtn = row.querySelector(".stat-btn.minus");

    const currentValue = character.stats[statName];
    const cost = getStatIncreaseCost(currentValue);

    input.value = currentValue;
    elements.ptsReqDisplays[index].textContent = cost;

    plusBtn.disabled = currentValue >= 99 || character.availablePoints < cost;
    minusBtn.disabled = currentValue <= 1;
  });

  // ================= HP BAR =================
  const maxHP = combatStats.maxHP;
  const currentHP = Math.min(maxHP, Math.floor(maxHP * 0.85)); // simulate current HP

  const hpFill = document.querySelector(".hp-fill");
  hpFill.style.width = `${Math.floor((currentHP / maxHP) * 100)}%`;

  const hpText = document.querySelector(
    ".vital-stats .bar-row:first-child .bar-text-input",
  );
  hpText.value = `${currentHP.toLocaleString()} / ${maxHP.toLocaleString()}`;
}

// ===================================================================
// EVENTS
// ===================================================================

function attachEventListeners() {
  const statOrder = ["str", "agi", "vit", "int", "dex", "luk"];

  statOrder.forEach((statName) => {
    const row = elements.statRows[statName];
    const input = row.querySelector(".stat-input");
    const plusBtn = row.querySelector(".stat-btn.plus");
    const minusBtn = row.querySelector(".stat-btn.minus");

    input.setAttribute("maxlength", "2");

    input.addEventListener("input", (e) => {
      let raw = e.target.value.replace(/\D/g, "");
      if (raw === "") {
        e.target.value = "";
        return;
      }

      let requestedValue = parseInt(raw);
      requestedValue = Math.max(1, Math.min(99, requestedValue));

      const totalPoints = getTotalStatPointsForLevel(character.baseLevel);
      const spentPointsExcludingThis = Object.keys(character.stats).reduce(
        (sum, stat) =>
          stat === statName
            ? sum
            : sum + getTotalCostToReachStat(1, character.stats[stat]),
        0,
      );

      let maxAllowed = 1;
      for (let i = 1; i <= 99; i++) {
        if (
          spentPointsExcludingThis + getTotalCostToReachStat(1, i) <=
          totalPoints
        ) {
          maxAllowed = i;
        } else {
          break;
        }
      }

      if (requestedValue > maxAllowed) {
        requestedValue = maxAllowed;
        row.classList.add("stat-error");
        setTimeout(() => row.classList.remove("stat-error"), 500);
      }

      e.target.value = requestedValue;
      trySetStat(statName, requestedValue);
    });

    input.addEventListener("blur", () => {
      if (!input.value || parseInt(input.value) < 1) {
        trySetStat(statName, 1);
      }
    });

    plusBtn.addEventListener("click", () => {
      trySetStat(statName, character.stats[statName] + 1);
    });

    minusBtn.addEventListener("click", () => {
      trySetStat(statName, character.stats[statName] - 1);
    });
  });

  elements.levelInput.addEventListener("input", (e) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw === "") return;
    updateLevel(parseInt(raw));
  });
}

// ===================================================================
// INIT
// ===================================================================

function initialize() {
  initializeElements();
  updateLevel(1);
  attachEventListeners();
}

document.addEventListener("DOMContentLoaded", initialize);
