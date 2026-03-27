import { character } from "../state/character.js";
import { updateJobLevel, getTotalJobBonus } from "./joblevel-system.js";
import { initializeStats } from "./baselevel-system.js";
import { updateUI } from "../ui/ui-updates.js";

// =============================
// 🔹 RESTORE JOB, LEVEL, GENDER, AND APPLY BONUSES
// =============================
export function restoreJobState() {
  const params = new URLSearchParams(window.location.search);
  const job = params.get("job") || "novice";
  const level = parseInt(params.get("jobLevel") || "1", 10);
  const gender = params.get("gender") || "male";

  // --- Step 1: Restore gender ---
  const maleBtn = document.getElementById("maleBtn");
  const femaleBtn = document.getElementById("femaleBtn");
  if (gender === "female") femaleBtn?.click();
  else maleBtn?.click();

  // --- Step 2: Restore job ---
  const jobEl = document.querySelector(`.job-item[data-job="${job}"]`);
  if (jobEl) jobEl.click(); // updates UI
  character.job = job; // ⚡ force internal state immediately

  // --- Step 3: Restore job level ---
  const jobLevelEl = document.getElementById("jobLevel");
  if (!isNaN(level)) {
    if (jobLevelEl) jobLevelEl.value = level;
    updateJobLevel(level); // ⚡ updates character.jobLevel
    character.jobLevel = level;

    // Trigger dropdown change event if there are other listeners
    if (jobLevelEl) jobLevelEl.dispatchEvent(new Event("change", { bubbles: true }));

    // Recalculate base stats
    initializeStats();

    // Update UI
    updateUI();

    // ⚡ Calculate bonuses using **forced job & level**
    const bonus = getTotalJobBonus(character.job, character.jobLevel);

    const jobBonusElements = document.querySelectorAll(".job-bonus-value");
    const statKeys = ["str", "agi", "vit", "int", "dex", "luk"];
    statKeys.forEach((stat, i) => {
      if (jobBonusElements[i]) jobBonusElements[i].textContent = bonus[stat] || 0;
    });

    console.log("[RESTORE] Job state restored:", { job, level, gender, bonus });
  }
}