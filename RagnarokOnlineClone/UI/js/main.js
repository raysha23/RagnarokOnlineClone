//File Path: js/main.js
import { initializeElements } from "./ui/ui-elements.js";
import { updateJobLevel } from "./systems/joblevel-system.js";
import { initializeStats } from "./systems/baselevel-system.js";
import { initializeUIEvents } from "./ui/ui-events.js";
import { updateDescription } from "./ui/ui-updates.js";
import { init as initSkills } from "./ui/skill-init.js";
import { updateUI } from "./ui/ui-updates.js";

// =============================
// 🚀 APPLICATION ENTRYPOINT
// =============================
window.addEventListener("DOMContentLoaded", () => {
  // 🔥 GLOBAL FLAG (IMPORTANT)
  window.isRestoringState = false;
  initializeElements();

  const params = new URLSearchParams(window.location.search);

  const job = params.get("job");
  const level = params.get("jobLevel");
  const gender = params.get("gender");

  const hasJobUI = !!document.querySelector(".job-item");

  if (hasJobUI) {
    initializeStats();
    initializeUIEvents();
    updateDescription("novice");
  }

  const isSkillPage =
    window.location.pathname.endsWith("skill-page.html") ||
    !!document.querySelector(".skill-tree-area");

  if (isSkillPage) {
    try {
      initSkills();
    } catch (err) {
      console.error("Failed to initialize skills module:", err);
    }
  }

  // =============================
  // 🔁 RESTORE STATE
  // =============================
  setTimeout(() => {
    console.log("===== RESTORE START =====");
    console.log("Params:", { job, level, gender });

    window.isRestoringState = true; // 🔥 ENABLE FLAG

    // ✅ Restore job
    if (job) {
      const jobEl = document.querySelector(`.job-item[data-job="${job}"]`);
      console.log("Clicking job:", job);
      if (jobEl) jobEl.click();
    }

    const jobLevelEl = document.getElementById("jobLevel");

    // ✅ Restore job level
    if (jobLevelEl && level) {
      const parsedLevel = parseInt(level, 10);

      console.log("Parsed Level:", parsedLevel);

      if (!isNaN(parsedLevel)) {
        jobLevelEl.value = parsedLevel;

        console.log("Calling updateJobLevel...");
        updateJobLevel(parsedLevel);
        updateUI();
        console.log("Dispatching change...");
        jobLevelEl.dispatchEvent(new Event("change"));
        
        // 🔥 FIX: Explicitly re-initialize stats after restore
        initializeStats();
        
      }

      if (isSkillPage) {
        jobLevelEl.disabled = true;
      }
    }

    // ✅ Restore gender
    if (gender === "female") {
      document.getElementById("femaleBtn")?.click();
    } else if (gender === "male") {
      document.getElementById("maleBtn")?.click();
    }

    window.isRestoringState = false; // 🔥 DISABLE FLAG

    console.log("===== RESTORE END =====");
  }, 100);
});

// =============================
// 🎯 GO TO SKILL PAGE
// =============================
async function goToSkills() {
  const activeJob =
    document.querySelector(".job-item.active")?.dataset.job || "novice";

  const maleBtn = document.getElementById("maleBtn");
  const gender =
    maleBtn && maleBtn.src?.includes("maleactive") ? "male" : "female";

  const jobLevelEl = document.getElementById("jobLevel");

  let jobLevel = "1";
  if (jobLevelEl && jobLevelEl.value) {
    const jl = parseInt(jobLevelEl.value, 10);
    if (!isNaN(jl)) {
      jobLevel = Math.max(1, Math.min(50, jl)).toString();
    }
  }

  window.location.href = `skill-page.html?job=${activeJob}&gender=${gender}&jobLevel=${jobLevel}`;
}

window.goToSkills = goToSkills;

// =============================
// 🔙 GO BACK HOME
// =============================
function goBackHome() {
  const activeJob =
    document.querySelector(".class-icons img.active")?.dataset.character ||
    "novice";

  const jobLevelEl = document.getElementById("jobLevel");

  let jobLevel = "1";
  if (jobLevelEl && jobLevelEl.value) {
    const jl = parseInt(jobLevelEl.value, 10);
    if (!isNaN(jl)) {
      jobLevel = Math.max(1, Math.min(50, jl)).toString();
    }
  }

  const maleBtn = document.getElementById("maleBtn");
  const gender =
    maleBtn && maleBtn.src?.includes("maleactive") ? "male" : "female";

  window.location.href = `home.html?job=${activeJob}&gender=${gender}&jobLevel=${jobLevel}`;
}

window.goBackHome = goBackHome;

// =============================
// 🎨 SPINNER STYLE
// =============================
const style = document.createElement("style");
style.textContent = `@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`;
document.head.appendChild(style);
