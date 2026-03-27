// File Path: js/main.js
import { initializeElements } from "./ui/ui-elements.js";
import { initializeStats } from "./systems/baselevel-system.js";
import { initializeUIEvents } from "./ui/ui-events.js";
import { updateDescription, updateUI } from "./ui/ui-updates.js";
import { init as initSkills } from "./ui/skill-init.js";
import { restoreJobState } from "./systems/job-restore.js"; // ✅ NEW RESTORE MODULE
import { gameData } from "./data/game-data.js";
// =============================
// 🚀 APPLICATION ENTRYPOINT
// =============================
window.addEventListener("DOMContentLoaded", () => {
  // 🔥 GLOBAL FLAG
  window.isRestoringState = false;


  // restore job state from URL or saved character
  // Initialize DOM references
  initializeElements();

  const hasJobUI = !!document.querySelector(".job-item");
  const isSkillPage =
    window.location.pathname.endsWith("skill-page.html") ||
    !!document.querySelector(".skill-tree-area");

  // ---------------- INITIALIZE MODULES ----------------
  if (hasJobUI) {
    initializeStats(); // Base stats, skill points
    initializeUIEvents(); // Job, hero, bars, stats
    updateDescription("novice");
  }
  if (isSkillPage) {
    try {
      initSkills(); // Skill tree initialization
    } catch (err) {
      console.error("Failed to initialize skills module:", err);
    }
  }
  // initialize character objects from jobData
  gameData.initCharacters();
  // ---------------- RESTORE STATE ----------------
  restoreJobState(); // ✅ Replaces all previous restore logic
});

// =============================
// 🎯 NAVIGATION TO SKILL PAGE
// =============================
async function goToSkills() {
  const activeJob =
    document.querySelector(".job-item.active")?.dataset.job || "novice";
  const maleBtn = document.getElementById("maleBtn");
  const gender =
    maleBtn && maleBtn.src.includes("maleactive") ? "male" : "female";

  const jobLevelEl = document.getElementById("jobLevel");
  let jobLevel = "1";
  if (jobLevelEl && jobLevelEl.value) {
    const jl = parseInt(jobLevelEl.value, 10);
    if (!isNaN(jl)) jobLevel = Math.max(1, Math.min(50, jl)).toString();
  }

  window.location.href = `skill-page.html?job=${activeJob}&gender=${gender}&jobLevel=${jobLevel}`;
}
window.goToSkills = goToSkills;

// =============================
// 🔙 NAVIGATION BACK TO HOME
// =============================
function goBackHome() {
  const activeJob =
    document.querySelector(".class-icons img.active")?.dataset.character ||
    "novice";

  const jobLevelEl = document.getElementById("jobLevel");
  let jobLevel = "1";
  if (jobLevelEl && jobLevelEl.value) {
    const jl = parseInt(jobLevelEl.value, 10);
    if (!isNaN(jl)) jobLevel = Math.max(1, Math.min(50, jl)).toString();
  }

  const maleBtn = document.getElementById("maleBtn");
  const gender = maleBtn && maleBtn.src.includes("maleactive") ? "male" : "female";

  window.location.href = `home.html?job=${activeJob}&gender=${gender}&jobLevel=${jobLevel}`;
}
window.goBackHome = goBackHome;

// =============================
// 🎨 GLOBAL SPINNER STYLE
// =============================
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  from { transform: rotate(0deg);}
  to { transform: rotate(360deg);}
}`;
document.head.appendChild(style);