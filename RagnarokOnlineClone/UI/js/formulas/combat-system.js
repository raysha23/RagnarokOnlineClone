function calculateCombatStats(character) {
  const { str, agi, vit, int, dex, luk } = character.stats;
  const level = character.baseLevel;

  // ----------------------------
  // STR (Strength)
  const strBonus = Math.floor(str / 10) ** 2;
  const attack = str + strBonus;
  const weightLimit = str * 30;

  // ----------------------------
  // AGI (Agility)
  const flee = level + agi;
  const attackSpeed = 150 + Math.floor(agi / 5);

  // ----------------------------
  // VIT (Vitality)
  const defense = vit;
  const baseHP = 1000;
  const maxHP = Math.floor(baseHP * (1 + vit * 0.01));

  // ============================
  // INT (Intelligence) — FIXED PROPERLY
  // ============================

  // Base MATK comes from INT itself
  const baseMatk = int;

  // Bonus every 7 INT → minimum MATK
  const minMatkBonus = Math.floor(int / 7) ** 2;

  // Bonus every 5 INT → maximum MATK
  const maxMatkBonus = Math.floor(int / 5) ** 2;

  const matkMin = baseMatk + minMatkBonus;
  const matkMax = baseMatk + maxMatkBonus;

  // ----------------------------
  // Magic Defense (approximation)
  const mdefBase = int;

  // ----------------------------
  // SP Calculations
  const baseSP = 500; // later replace per job
  const maxSP = Math.floor(baseSP * (1 + int * 0.01)); // +1% SP per INT
  const spRegen = Math.floor(int / 6); // +1 regen every 6 INT
  const spRecoveryBonusPercent = int; // +1% item effectiveness per INT

  // ----------------------------
  // DEX (Dexterity)
  const hit = level + dex;

  // ----------------------------
  // LUK (Luck)
  const crit = Math.max(1, Math.floor(luk * 0.3));

  return {
    attack,
    matkMin,
    matkMax,
    mdefBase,
    hit,
    flee,
    crit,
    defense,
    attackSpeed,
    weightLimit,
    maxHP,
    maxSP,
    spRegen,
    spRecoveryBonusPercent,
  };
}
