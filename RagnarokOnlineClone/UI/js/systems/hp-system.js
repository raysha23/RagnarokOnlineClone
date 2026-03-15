//Folder Path: RagnarokOnlineClone/UI/js/systems/hp-system.js
import { jobData } from "../data/job-data.js";

export function calculateHP(character) {
  const level = character.baseLevel;
  const job = character.job;
  const VIT = character.stats?.vit || 0;
  const data = jobData[job]?.stats;
  if (!data) return 0;

  // 1️⃣ Base HP
  let BASE_HP = 35 + level * (data.hpB || 5); // multiply by level once

  for (let i = 2; i <= level; i++) {
    BASE_HP += Math.round((data.hpA || 0) * i); // cumulative growth
  }

  // 2️⃣ Max HP
  let MAX_HP = Math.floor(BASE_HP * (1 + VIT * 0.01) * (data.TRANS_MOD || 1));

  // 3️⃣ Additive modifiers
  MAX_HP += data.HP_MOD_A || 0;

  // 4️⃣ Multiplicative modifiers
  MAX_HP = Math.floor(MAX_HP * (1 + (data.HP_MOD_B || 0) * 0.01));

  return MAX_HP;
}
