// ======================================
// CORE FORMULAS
// ======================================

function calculateHP(character) {
  const level = character.baseLevel;
  const job = character.job;
  const VIT = character.stats?.vit || 0;
  const data = jobData[job];
  if (!data) return 0;

  // 1️⃣ Base HP
  let BASE_HP = 35 + level * (data.hpB || 5); // multiply by level once

  for (let i = 2; i <= level; i++) {
    BASE_HP += Math.round((data.hpA || 0) * i); // cumulative growth
  }

  // 2️⃣ Max HP
  let MAX_HP = Math.floor(BASE_HP * (1 + VIT * 0.01) * (data.TRANS_MOD || 1));

  // 3️⃣ Additive modifiers
  MAX_HP += data.HP_MOD_A || 0;

  // 4️⃣ Multiplicative modifiers
  MAX_HP = Math.floor(MAX_HP * (1 + (data.HP_MOD_B || 0) * 0.01));

  return MAX_HP;
}
function calculateSP(character) {
  const level = character.baseLevel;
  const job = character.job;
  const INT = character.stats?.int || 0; // “INT” in your snippet
  const data = jobData[job];

  if (!data) return 0;

  // 1️⃣ BASE_SP = baseSP + level * spB
  let Base_SP = data.baseSP + level * data.spB;

  // 2️⃣ MAX_SP = Math.floor(Base_SP * (1 + INT * 0.01))
  let MAX_SP = Math.floor(Base_SP * (1 + INT * 0.01));

  // 3️⃣ add flat modifier
  MAX_SP += data.SP_MOD_A || 0;

  // 4️⃣ apply percent modifier
  MAX_SP = Math.floor(MAX_SP * (1 + (data.SP_MOD_B || 0) * 0.01));

  // 5️⃣ transformation multiplier
  MAX_SP = Math.floor(MAX_SP * (data.TRANS_MOD || 1));

  return MAX_SP;
}
function calculateHPRegen(maxHP, character) {
  const vit = character.stats.vit;
  const hprMod = character.hprMod || 0;

  // base regen
  let HPR = 1 + Math.floor(maxHP / 200);

  // vit bonus
  HPR += Math.floor(vit / 5);

  // modifiers
  HPR = Math.floor(HPR * (1 + hprMod * 0.01));

  return HPR;
}
function calculateSPRegen(maxSP, character) {
  const intStat = character.stats.int;
  const sprMod = character.sprMod || 0;

  let SPR = 1;

  SPR += Math.floor(maxSP / 100);
  SPR += Math.floor(intStat / 6);

  if (intStat >= 120) {
    SPR += Math.floor(intStat / 2 - 56);
  }

  SPR = Math.floor(SPR * (1 + sprMod * 0.01));

  return SPR;
}
function calculateWeight(character) {
  const str = character.stats?.str || 0;
  const job = character.job;

  const data = jobData[job];
  if (!data) {
    console.warn(`Unknown job "${job}" encountered in calculateWeight.`);
    return 2000 + str * 30;
  }

  const jobWeight = data.weight || 0;

  // optional modifiers
  const enlargeWeight = character.skills?.enlargeWeight || 0; // merchant skill level
  const gymPass = character.mods?.gymPass || 0; // kafra gym pass levels
  const pecoRide = character.mods?.pecoRide ? 1000 : 0;

  const WGT_MOD = (enlargeWeight + gymPass) * 200 + pecoRide;

  let MAX_WGT = 2000;
  MAX_WGT += 30 * str;
  MAX_WGT += jobWeight;
  MAX_WGT += WGT_MOD;

  return MAX_WGT;
}
function calculateASPD(character) {
  const agi = character.stats.agi;
  const dex = character.stats.dex;
  const job = character.job;
  const weapon = character.weapon;

  const btba = weaponData[job]?.[weapon] || 1.5;
  const WD = btba * 50;

  // Sum AGI and DEX bonuses first, then round
  const totalBonus = Math.round((WD * agi) / 25 + (WD * dex) / 100);

  // Divide by 10 for delay reduction
  const delayReduction = totalBonus / 10;

  const SM = character.speedMod || 0;

  const aspdValue = 200 - (WD - delayReduction) * (1 - SM);

  // Log all the intermediate steps
  console.log(
    `ASPD Calculation:
    Job: ${job}
    Weapon: ${weapon}
    BTBA: ${btba}
    WD: ${WD}
    AGI Bonus: ${Math.round((WD * agi) / 25)}
    DEX Bonus: ${Math.round((WD * dex) / 100)}
    Total Bonus (rounded): ${totalBonus}
    Delay Reduction: ${delayReduction.toFixed(2)}
    Speed Modifier (SM): ${SM}
    Final ASPD: ${Math.floor(aspdValue)}`,
  );

  return Math.floor(aspdValue);
}
// ======================================
// MAIN COMBAT STAT CALCULATIONS
// ======================================
function calculateCombatStats(character) {
  const { str, agi, vit, int, dex, luk } = character.stats;
  const level = character.baseLevel;

  // ----------------------------
  // ATTACK
  const strBonus = Math.floor(str / 10) ** 2;
  const dexMeleeBonus = Math.floor(dex / 5);
  const lukAttackBonus = Math.floor(luk / 5);

  const attack = str + strBonus + dexMeleeBonus + lukAttackBonus;

  // ----------------------------
  // MAGIC ATTACK
  const baseMatk = int;
  const minMatkBonus = Math.floor(int / 7) ** 2;
  const maxMatkBonus = Math.floor(int / 5) ** 2;

  const matkMin = baseMatk + minMatkBonus;
  const matkMax = baseMatk + maxMatkBonus;

  // ----------------------------
  // HIT
  const hit = level + dex;

  // ----------------------------
  // CRITICAL
  const crit = Math.max(1, Math.floor(luk * 0.3) + 1);

  // ----------------------------
  // FLEE
  const fleeBase = level + agi;
  const fleeBonusFromLuk = Math.floor(luk / 10);

  const flee = fleeBase + fleeBonusFromLuk;

  // ----------------------------
  // DEF / MDEF
  const defense = vit;
  const mdefBase = int;

  // ----------------------------
  // OTHER SYSTEMS
  const maxHP = calculateHP(character);
  const maxSP = calculateSP(character);

  const hpRegen = calculateHPRegen(maxHP, character);
  const spRegen = calculateSPRegen(maxSP, character);

  const weightLimit = calculateWeight(character);
  const attackSpeed = calculateASPD(character);

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
    hpRegen,
    spRegen,
  };
}
// ======================================
// UPDATE UI
// ======================================


