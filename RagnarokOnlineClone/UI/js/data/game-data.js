// File: js/data/game-data.js
import { jobData } from "./job-data.js";
import { state } from "../state/skill-state.js";

export const gameData = {
  characters: {}, // <-- this will store per-job current stats

  // Initialize characters from jobData
  initCharacters() {
    Object.keys(jobData).forEach((job) => {
      if (!this.characters[job]) {
        this.characters[job] = {
          stats: { ...jobData[job].stats }, // start with job base stats
          jobLevel: 1,
          skills: {}, // optional: skill points
        };
      }
    });
  },

  // Apply skill bonuses dynamically
  applySkillBonuses(job) {
    const char = this.characters[job];
    if (!char) return;

    // 🔁 Reset stats first (IMPORTANT to avoid stacking!)
    char.stats = { ...jobData[job].stats };

    const skills = state.characterSkillLevels;

    Object.keys(skills).forEach((skillKey) => {
      const level = skills[skillKey];

      if (level <= 0) return;

      // 👉 Example: handle specific skills
      if (skillKey === "MerchantEnlargeWeightLimit") {
        char.stats.weight = (char.stats.weight || 0) + 200 * level;
      }

      // 👉 Add more skills here later
    });
  },
};
