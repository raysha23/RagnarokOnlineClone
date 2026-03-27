// File: js/systems/job-restore.js
import { character } from "../state/character.js";
import { updateJobLevel, getTotalJobBonus } from "./joblevel-system.js";
import { initializeStats } from "./baselevel-system.js";
import { updateUI } from "../ui/ui-updates.js";
import { gameData } from "../data/game-data.js";
import { jobData } from "../data/job-data.js";

export function restoreJobState() {
    const params = new URLSearchParams(window.location.search);

    // --- Step 0: Restore base level ---
    const baseLevel = parseInt(params.get("baseLevel") || character.baseLevel || "1", 10);
    character.baseLevel = baseLevel;
    const baseLevelEl = document.getElementById("baseLevel");
    if (baseLevelEl) {
        baseLevelEl.value = baseLevel;
        baseLevelEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // --- Step 1: Restore gender ---
    const gender = params.get("gender") || "male";
    const maleBtn = document.getElementById("maleBtn");
    const femaleBtn = document.getElementById("femaleBtn");
    if (gender === "female") femaleBtn?.click();
    else maleBtn?.click();

    // --- Step 2: Restore job ---
    const job = params.get("job") || character.job || "novice";
    const jobEl = document.querySelector(`.job-item[data-job="${job}"]`);
    if (jobEl) jobEl.click(); // updates UI
    character.job = job;

    // --- Step 3: Restore job level ---
    const jobLevel = parseInt(params.get("jobLevel") || character.jobLevel || "1", 10);
    const jobLevelEl = document.getElementById("jobLevel");
    if (!isNaN(jobLevel)) {
        if (jobLevelEl) jobLevelEl.value = jobLevel;
        updateJobLevel(jobLevel);
        character.jobLevel = jobLevel;
        if (jobLevelEl) jobLevelEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // --- Step 4: Restore stats from gameData ---
    let jobBonus = {}; // for later UI display

    if (!gameData.characters[job]) {
        console.warn(`[RESTORE] No character data found for job '${job}'. Initializing...`);
        gameData.initCharacters();
    }

    const savedChar = gameData.characters[job];

    // Apply saved base stats from gameData
    if (savedChar) {
        character.stats = { ...savedChar.stats }; // base stats from job
        jobBonus = getTotalJobBonus(job, character.jobLevel);

        // Add job bonus stats
        Object.keys(jobBonus).forEach(stat => {
            character.stats[stat] = (character.stats[stat] || 0) + jobBonus[stat];
        });

        // Apply skill bonuses
        gameData.applySkillBonuses(job);
    }

    // Now initialize base level stats and leftover points
    initializeStats();
    // --- Step 5: Recalculate base stats & update UI ---
    initializeStats(); // must use character.baseLevel + character.jobLevel
    updateUI();

    // --- Step 6: Update job bonus display ---
    // Update job bonus display
    const bonusValues = document.querySelectorAll(".job-bonus-value");
    const statKeys = ["str", "agi", "vit", "int", "dex", "luk"];
    statKeys.forEach((stat, i) => {
        if (bonusValues[i]) bonusValues[i].textContent = jobBonus[stat] || 0;
    });

    console.log("[RESTORE] Job state restored:", {
        baseLevel,
        job,
        jobLevel,
        gender,
        stats: character.stats,
        jobBonus,
    });
}