// Folder Path: RagnarokOnlineClone/UI/js/systems/joblevel-system.js

import { character } from "../state/character.js";
import { jobData } from "../data/job-data.js";
import { updateUI } from "../ui/ui-updates.js";
import { elements } from "../ui/ui-elements.js";

// ======================================================
// JOB LEVEL SYSTEM
// ======================================================

export function updateJobLevel(newLevel) {
  // Clamp level between 1 and 50
  newLevel = Math.max(1, Math.min(50, parseInt(newLevel) || 1));
  character.jobLevel = newLevel;

  updateUI();
}

// ======================================================
// JOB BONUS CALCULATION
// ======================================================

export function getTotalJobBonus(jobArg, levelArg) {
  const job = jobArg || (character && character.job) || 'novice';
  const currentLevel = levelArg || (character && character.jobLevel) || 1;

  const jobEntry = (jobData && jobData[job]) ? jobData[job] : jobData['novice'];
  const bonusData = jobEntry.jobBonus || {};
  const totalBonus = { str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 };

  for (let lvl in bonusData) {
    if (parseInt(lvl, 10) <= currentLevel) {
      const stats = bonusData[lvl];
      for (let key in stats) {
        if (totalBonus[key] !== undefined) totalBonus[key] += stats[key];
      }
    }
  }

  return totalBonus;
}