// File: js/systems/job-restore.js
import { character } from "../state/character.js";
import { updateJobLevel, getTotalJobBonus } from "./joblevel-system.js";
import { initializeStats } from "./baselevel-system.js";
import { updateUI } from "../ui/ui-updates.js";
import { gameData } from "../data/game-data.js";
import { jobData } from "../data/job-data.js";

const statKeys = ["str", "agi", "vit", "int", "dex", "luk"];
character.baseStats = character.baseStats || { ...character.stats };

export function restoreJobState() {
    // After importing character
    character.baseStats = character.baseStats || { ...character.stats };
    const params = new URLSearchParams(window.location.search);

    // --- Step 0: Restore base level ---
    const baseLevel = parseInt(params.get("baseLevel") || character.baseLevel || "1", 10);
    character.baseLevel = baseLevel;

    const baseLevelEl = document.getElementById("baseLevel");
    if (baseLevelEl) {
        baseLevelEl.value = baseLevel;
        baseLevelEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // --- Step 1: Restore stats from URL ---
    statKeys.forEach(stat => {
        const value = parseInt(params.get(stat), 10);
        if (!isNaN(value)) {
            character.stats[stat] = value;
        }
    });

    // --- Step 2: Restore gender ---
    const gender = params.get("gender") || "male";
    const maleBtn = document.getElementById("maleBtn");
    const femaleBtn = document.getElementById("femaleBtn");
    if (gender === "female") femaleBtn?.click();
    else maleBtn?.click();

    // --- Step 3: Restore job ---
    const job = params.get("job") || character.job || "novice";
    character.job = job;

    const jobEl = document.querySelector(`.job-item[data-job="${job}"]`);
    if (jobEl) jobEl.click(); // triggers UI updates, weapon dropdown, hero image

    // --- Step 4: Restore job level ---
    const jobLevel = parseInt(params.get("jobLevel") || character.jobLevel || "1", 10);
    const jobLevelEl = document.getElementById("jobLevel");
    if (!isNaN(jobLevel)) {
        character.jobLevel = jobLevel;
        updateJobLevel(jobLevel);
        if (jobLevelEl) {
            jobLevelEl.value = jobLevel;
            jobLevelEl.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    // --- Step 5: Restore job & skill bonuses from gameData ---
    let jobBonus = {};
    if (!gameData.characters[job]) {
        console.warn(`[RESTORE] No character data for job '${job}', initializing...`);
        gameData.initCharacters();
    }

    const savedChar = gameData.characters[job];
    if (savedChar) {
        // Only add job bonuses, DO NOT overwrite manually restored stats
        jobBonus = getTotalJobBonus(job, character.jobLevel);

        statKeys.forEach(stat => {
            const base = character.baseStats[stat] || 0; // player-assigned stats
            const jobB = jobBonus[stat] || 0;           // job bonus
            const skillB = gameData.skillBonuses?.[job]?.[stat] || 0; // skill bonus if any
            character.stats[stat] = base + jobB + skillB;
        });

        // Apply skill bonuses if any
        gameData.applySkillBonuses(job);
    }

    // --- Step 6: Initialize base stats (calculates HP/MP, etc.) ---
    initializeStats(); // uses character.baseLevel + character.jobLevel

    // --- Step 7: Update UI ---
    updateUI();

    // --- Step 8: Update job bonus display ---
    const bonusValues = document.querySelectorAll(".job-bonus-value");
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