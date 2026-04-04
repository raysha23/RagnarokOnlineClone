// File: js/systems/combat-system.js

import { calculateHP } from "./hp-system.js";
import { calculateSP } from "./sp-system.js";
import { calculateHPRegen, calculateSPRegen } from "./regen-system.js";
import { calculateWeight } from "./weight-system.js";
import { calculateASPD } from "./aspd-system.js";
import { getTotalJobBonus } from "./joblevel-system.js";
import { state } from "../state/skill-state.js";

// ======================================
// MAIN COMBAT STAT CALCULATIONS
// ======================================
export function calculateCombatStats(character) {
  const baseStats = character.stats || {};
  const jobBonus = getTotalJobBonus() || {};

  const str = (baseStats.str || 0) + (jobBonus.str || 0);
  const agi = (baseStats.agi || 0) + (jobBonus.agi || 0);
  const vit = (baseStats.vit || 0) + (jobBonus.vit || 0);
  const int = (baseStats.int || 0) + (jobBonus.int || 0);
  const dex = (baseStats.dex || 0) + (jobBonus.dex || 0);
  const luk = (baseStats.luk || 0) + (jobBonus.luk || 0);
  const level = parseInt(character.baseLevel) || 1;

  // ======================================
  // SKILL VALUES (FIXED - FLAT STRUCTURE)
  // ======================================

  // Swordsman
  const swordMastery = state.characterSkillLevels["SwordsmanSwordMastery"] || 0;

  const twoHanded = state.characterSkillLevels["SwordsmanTwoHandedSM"] || 0;

  const hpRecoverySkill =
    state.characterSkillLevels["SwordsmanIncreaseRP"] || 0;

  // Magician
  const spRecoverySkill =
    state.characterSkillLevels["MagicianIncreaseSPRecovery"] || 0;

  // Archer
  const owlsEye = state.characterSkillLevels["ArcherOwlsEye"] || 0;

  const vulturesEye = state.characterSkillLevels["ArcherVulturesEye"] || 0;

  // Acolyte
  const demonBane = state.characterSkillLevels["AcolyteDemonBane"] || 0;

  const divineProtection =
    state.characterSkillLevels["AcolyteDivineProtection"] || 0;

  // Merchant
  const weightSkill =
    state.characterSkillLevels["MerchantEnlargeWeightLimit"] || 0;

  // Thief
  const doubleAttack = state.characterSkillLevels["ThiefDoubleAttack"] || 0;

  const improveDodge = state.characterSkillLevels["ThiefIncreaseDodge"] || 0;

  // ======================================
  // MODIFIED BASE STATS
  // ======================================

  const dexFinal = dex + owlsEye;

  // ----------------------------
  // ATTACK
  const strBonus = Math.floor(str / 10) ** 2;
  const dexMeleeBonus = Math.floor(dexFinal / 5);
  const lukAttackBonus = Math.floor(luk / 5);

  const attackSkillBonus = swordMastery * 4 + twoHanded * 4 + demonBane * 3;

  const attack =
    str + strBonus + dexMeleeBonus + lukAttackBonus + attackSkillBonus;

  // ----------------------------
  // MAGIC ATTACK
  const baseMatk = int;
  const minMatkBonus = Math.floor(int / 7) ** 2;
  const maxMatkBonus = Math.floor(int / 5) ** 2;

  const matkMin = baseMatk + minMatkBonus;
  const matkMax = baseMatk + maxMatkBonus;

  // ----------------------------
  // HIT
  const hit = level + dexFinal + vulturesEye + doubleAttack;

  // ----------------------------
  // CRITICAL
  const crit = Math.max(1, Math.floor(luk * 0.3) + 1);

  // ----------------------------
  // FLEE
  const flee = level + agi + improveDodge * 3;

  // ----------------------------
  // DEF / MDEF
  const defense = vit + divineProtection * 3;
  const mdefBase = int;

  // ----------------------------
  // HP / SP
  const maxHP = calculateHP(character);
  const maxSP = calculateSP(character);

  const baseHpRegen = calculateHPRegen(maxHP, character);
  const baseSpRegen = calculateSPRegen(maxSP, character);

  const hpRegen = baseHpRegen + hpRecoverySkill * 5;
  const spRegen = baseSpRegen + spRecoverySkill * 3;

  // ----------------------------
  // WEIGHT
  const weightLimit = calculateWeight(character) + weightSkill * 200;

  // ----------------------------
  // ASPD
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
