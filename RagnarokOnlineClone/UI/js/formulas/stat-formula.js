//Folder Path: RagnarokOnlineClone/UI/js/formulas/stat-formula.js

import { character } from "../state/character.js";
import { updateUI } from "../ui/ui-updates.js";
import { elements } from "../ui/ui-elements.js";

// ======================================================
// STAT FORMULAS
// ======================================================

export function getPointsForLevel(level) {
  if (level <= 4) return 3;
  if (level >= 95) return 22;
  return Math.floor((level - 1) / 5) + 3;
}

export function getTotalStatPointsForLevel(level) {
  const STARTING_STATUS_POINTS = 48;

  if (level === 1) return STARTING_STATUS_POINTS;

  let total = STARTING_STATUS_POINTS;

  for (let i = 2; i <= level; i++) {
    total += getPointsForLevel(i);
  }

  return total - 1;
}

export function getStatIncreaseCost(currentStatValue) {
  return Math.min(Math.floor((currentStatValue - 1) / 10) + 2, 11);
}

export function getTotalCostToReachStat(currentStat, targetStat) {
  let totalCost = 0;

  for (let i = currentStat; i < targetStat; i++) {
    totalCost += getStatIncreaseCost(i);
  }

  return totalCost;
}

export function initializeStats() {
  // Initialize base character stats and UI on app load
  // If the UI has pre-filled base level, use that.
  const initialLevel = elements.levelInput
    ? parseInt(elements.levelInput.value, 10)
    : character.baseLevel;

  const normalizedLevel = Number.isFinite(initialLevel)
    ? Math.max(1, Math.min(99, initialLevel))
    : character.baseLevel;

  updateLevel(normalizedLevel);
}

// ======================================================
// CORE LOGIC
// ======================================================

export function calculateRemainingPointsWithChange(statName, newValue) {
  const totalPoints = getTotalStatPointsForLevel(character.baseLevel);

  const spentPoints = Object.keys(character.stats).reduce((sum, stat) => {
    const value = stat === statName ? newValue : character.stats[stat];

    return sum + getTotalCostToReachStat(1, value);
  }, 0);

  return totalPoints - spentPoints;
}

export function trySetStat(statName, newValue) {
  newValue = Math.max(1, Math.min(99, parseInt(newValue) || 1));

  const remaining = calculateRemainingPointsWithChange(statName, newValue);

  if (remaining < 0) return;

  character.stats[statName] = newValue;
  character.availablePoints = remaining;

  updateUI();
}

// ======================================================
// LEVEL SYSTEM
// ======================================================

export function updateLevel(newLevel) {
  newLevel = Math.max(1, Math.min(99, parseInt(newLevel) || 1));

  character.baseLevel = newLevel;

  const totalPoints = getTotalStatPointsForLevel(newLevel);

  const spentPoints = Object.values(character.stats).reduce((sum, value) => {
    return sum + getTotalCostToReachStat(1, value);
  }, 0);

  character.availablePoints = Math.max(0, totalPoints - spentPoints);

  updateUI();
}
