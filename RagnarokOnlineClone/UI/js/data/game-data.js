// File: js/data/game-data.js
import { jobData } from "./job-data.js";

export const gameData = {
  characters: {}, // <-- this will store per-job current stats

  // Initialize characters from jobData
  initCharacters() {
    Object.keys(jobData).forEach(job => {
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

    // Example: loop through skills and add stat bonuses
    if (char.skills) {
      Object.values(char.skills).forEach(skill => {
        if (skill.bonus) {
          Object.keys(skill.bonus).forEach(stat => {
            char.stats[stat] = (char.stats[stat] || 0) + skill.bonus[stat];
          });
        }
      });
    }
  },
};