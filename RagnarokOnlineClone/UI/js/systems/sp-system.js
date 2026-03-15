//Folder Path: RagnarokOnlineClone/UI/js/systems/sp-system.js
import { jobData } from "../data/job-data.js";

export function calculateSP(character) {
  const level = character.baseLevel;
  const job = character.job;
  const INT = character.stats?.int || 0; // “INT” in your snippet
  const data = jobData[job]?.stats;

  if (!data) return 0;

  // 1️⃣ BASE_SP = baseSP + level * spB
  let Base_SP = data.baseSP + level * data.spB

  // 2️⃣ MAX_SP = Math.floor(Base_SP * (1 + INT * 0.01))
  let MAX_SP = Math.floor(Base_SP * (1 + INT * 0.01));

  // 3️⃣ add flat modifier
  MAX_SP += data.SP_MOD_A || 0;

  // 4️⃣ apply percent modifier
  MAX_SP = Math.floor(MAX_SP * (1 + (data.SP_MOD_B || 0) * 0.01));

  // 5️⃣ transformation multiplier
  MAX_SP = Math.floor(MAX_SP * (data.TRANS_MOD || 1));

  return MAX_SP;
}