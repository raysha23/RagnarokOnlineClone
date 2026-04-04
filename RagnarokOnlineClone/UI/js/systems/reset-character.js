// File: RagnarokOnlineClone/UI/js/systems/reset-character.js
import { character } from "../state/character.js";
import { resetState as resetSkillState } from "../state/skill-state.js";

export function resetCharacter(job) {
  character.baseLevel = 1;
  character.jobLevel = 1;
  character.job = job;

  character.stats = {
    str: 1,
    agi: 1,
    vit: 1,
    int: 1,
    dex: 1,
    luk: 1,
  };

  character.baseStats = { ...character.stats };
  // ✅ RESET STAT POINTS
  character.availablePoints = 48;
  
  resetSkillState();

  // ✅ CLEAR STORAGE
  localStorage.removeItem(`skillState_${job}`);
  localStorage.removeItem("characterStats");

  console.log("[RESET] Character fully reset:", job);
}