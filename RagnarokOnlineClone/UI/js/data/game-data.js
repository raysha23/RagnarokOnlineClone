// Folder: RagnarokOnlineClone/UI/js/data/gameData.js
import { jobData } from "./job-data.js";

// ========== DYNAMIC GAME DATA PER CHARACTER ==========
export const gameData = {
  characters: {
    novice: {
      jobLevel: 1,
      stats: { ...jobData.novice.stats }, // clone base stats
      skills: {
        // No passive skills for novice
      },
    },

    swordsman: {
      jobLevel: 1,
      stats: { ...jobData.swordsman.stats },
      skills: {
        increaseHPRecovery: 0, // +5 HP per level
        swordMastery: 0,       // +4 Attack per level
        twoHandedSword: 0,     // +4 Attack per level
      },
    },

    magician: {
      jobLevel: 1,
      stats: { ...jobData.magician.stats },
      skills: {
        increaseSPRecovery: 0, // +3 SP per level
      },
    },

    archer: {
      jobLevel: 1,
      stats: { ...jobData.archer.stats },
      skills: {
        owlsEye: 0,    // +1 DEX per level
        vulturesEye: 0 // +1 HIT per level
      },
    },

    merchant: {
      jobLevel: 1,
      stats: { ...jobData.merchant.stats },
      skills: {
        enlargeWeightLimit: 0, // +200 weight per level
      },
    },

    thief: {
      jobLevel: 1,
      stats: { ...jobData.thief.stats },
      skills: {
        doubleAttack: 0, // +1 HIT per level
        improveDodge: 0, // +3 FLEE per level
      },
    },

    acolyte: {
      jobLevel: 1,
      stats: { ...jobData.acolyte.stats },
      skills: {
        demonBane: 0,       // +3 Attack per level
        divineProtection: 0 // +3 DEF per level
      },
    },
  },

  // Utility function to apply passive skill bonuses dynamically
  applySkillBonuses(characterKey) {
    const char = this.characters[characterKey];
    if (!char) return;

    // Reset stats to base first
    char.stats = { ...jobData[characterKey].stats };

    // Apply skill bonuses
    const skills = char.skills;
    if (!skills) return;

    switch (characterKey) {
      case "swordsman":
        char.stats.hpB += 5 * skills.increaseHPRecovery;
        char.stats.atk = (char.stats.atk || 0) + 4 * (skills.swordMastery + skills.twoHandedSword);
        break;
      case "magician":
        char.stats.spB += 3 * skills.increaseSPRecovery;
        break;
      case "archer":
        char.stats.dex = (char.stats.dex || 0) + skills.owlsEye;
        char.stats.hit = (char.stats.hit || 0) + skills.vulturesEye;
        break;
      case "merchant":
        char.stats.weight += 200 * skills.enlargeWeightLimit;
        break;
      case "thief":
        char.stats.hit = (char.stats.hit || 0) + skills.doubleAttack;
        char.stats.flee = (char.stats.flee || 0) + 3 * skills.improveDodge;
        break;
      case "acolyte":
        char.stats.atk = (char.stats.atk || 0) + 3 * skills.demonBane;
        char.stats.def = (char.stats.def || 0) + 3 * skills.divineProtection;
        break;
    }
  },
};