// ===================================================================
// RAGNAROK COMBAT SYSTEM - UPDATED TO iRO CLASSIC STATS
// ===================================================================

function calculateCombatStats(character) {
  const { str, agi, vit, int, dex, luk } = character.stats;
  const level = character.baseLevel;

  // ----------------------------
  // PRIMARY DERIVED CALCULATIONS
  // ----------------------------

  // ----------------------------
  // STR (Strength)
  // Every 1 STR = +1 ATK
  // Every 10 STR = additional bonus: [STR / 10]^2
  // ----------------------------
  const strBonus = Math.floor(str / 10) ** 2;
  const attack = str + strBonus;

  // Weight Limit (base only)
  const weightLimit = str * 30;

  // ----------------------------
  // AGI (Agility)
  // Flee = AGI + level
  // Attack Speed (simplified base version)
  // ----------------------------
  const flee = level + agi;

  // Base ASPD formula: Each 1 AGI = -0.4% attack delay
  // We'll use a simplified version for UI: 150 + floor(agi / 2)
  const attackSpeed = 150 + Math.floor(agi / 2);

  // ----------------------------
  // VIT (Vitality)
  // Soft DEF = VIT
  // Max HP = handled elsewhere
  // ----------------------------
  const defense = vit;
  // Magic Defense (simplified)
  const magicDefense = Math.floor(int / 2) + Math.floor(vit / 5);

  // ----------------------------
  // INT (Intelligence)
  // MATK formula approximation
  // ----------------------------
  const matkMin = int + Math.floor(int / 7) ** 2;
  const matkMax = int + Math.floor(int / 5) ** 2;
  const magicAttack = Math.floor((matkMin + matkMax) / 2);

  // ----------------------------
  // DEX (Dexterity)
  // Hit = level + DEX
  // ----------------------------
  const hit = level + dex;

  // ----------------------------
  // LUK (Luck)
  // Crit = floor(LUK * 0.3) with a minimum of 1
  // ----------------------------
  const crit = Math.max(1, Math.floor(luk * 0.3));

  return {
    attack,
    matkMin,
    matkMax,
    magicAttack,
    hit,
    flee,
    crit,
    defense,
    magicDefense,
    attackSpeed,
    weightLimit,
  };
}
