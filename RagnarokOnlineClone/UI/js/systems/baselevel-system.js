//File Path: RagnarokOnlineClone/UI/js/systems/baselevel-syster.js
import { elements } from "../ui/ui-elements.js";
import { character } from "../state/character.js";
import { updateUI } from "../ui/ui-updates.js";
import { getTotalCostToReachStat } from "../formulas/stat-formula.js";
import { getTotalStatPointsForLevel } from "../formulas/stat-formula.js";

export function updateLevel(newLevel) {
  newLevel = Math.max(1, Math.min(99, parseInt(newLevel) || 1));
  character.baseLevel = newLevel;

  // Start from manual stats
  character.calcStats = { ...character.stats };

  const totalPoints = getTotalStatPointsForLevel(newLevel);
  adjustStatsToLevel(totalPoints);

  const spentPoints = getSpentPoints();
  character.availablePoints = Math.max(0, totalPoints - spentPoints);

  updateUI();
}


export function initializeStats() {
  // Only set baseStats if it doesn't exist
  if (!character.calcStats) {
    character.calcStats = { ...character.stats }; // store the initial stats
  }

  // Restore stats from baseStats instead of overwriting with defaults
  // character.stats = { ...character.calcStats };

  // If level input exists, apply level-based points on top
  const initialLevel = elements.levelInput
    ? parseInt(elements.levelInput.value, 10)
    : character.baseLevel;

  const normalizedLevel = Number.isFinite(initialLevel)
    ? Math.max(1, Math.min(99, initialLevel))
    : character.baseLevel;

  updateLevel(normalizedLevel);
}
export function adjustStatsToLevel(totalPoints) {
  let spentPoints = getSpentPoints();

  while (spentPoints > totalPoints) {
    const oldStats = { ...character.calcStats };

    if (!decreaseHighestStat()) break;

    const newSpentPoints = getSpentPoints();

    if (newSpentPoints >= spentPoints) break;

    spentPoints = newSpentPoints;
  }
}

export function decreaseHighestStat() {
  let highestKey = null;
  let highestValue = -Infinity;

  for (const [key, value] of Object.entries(character.calcStats)) {
    if (value > highestValue) {
      highestValue = value;
      highestKey = key;
    }
  }

  if (!highestKey || character.calcStats[highestKey] <= 1) return false;

  character.calcStats[highestKey] -= 1;
  return true;
}

export function getSpentPoints() {
  return Object.values(character.calcStats).reduce((sum, value) => {
    return sum + getTotalCostToReachStat(1, value);
  }, 0);
}
