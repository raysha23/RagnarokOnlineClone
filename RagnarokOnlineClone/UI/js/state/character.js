//File Pathing: RagnarokOnlineClone/UI/js/state/character.js
export const character = {
  baseLevel: 1,
  job: "novice",
  weapon: "hand",
  speedMod: 0,
  stats: {
    str: 1,
    agi: 1,
    vit: 1,
    int: 1,
    dex: 1,
    luk: 1,
  },
  // Calculated stats = stats + level points + job bonuses
  calcStats: {
    str: 1,
    agi: 1,
    vit: 1,
    int: 1,
    dex: 1,
    luk: 1,
  },
  availablePoints: 0,
  skills: {
    swordsman: {
      hpRecovery: 0,
      swordMastery: 0,
      twoHandedSwordMastery: 0,
    },
    magician: {
      spRecovery: 0,
    },
    archer: {
      owlsEye: 0,
      vulturesEye: 0,
    },
    acolyte: {
      demonBane: 0,
      divineProtection: 0,
    },
    merchant: {
      enlargeWeight: 0,
    },
    thief: {
      doubleAttack: 0,
      improveDodge: 0,
    },
  },
};
