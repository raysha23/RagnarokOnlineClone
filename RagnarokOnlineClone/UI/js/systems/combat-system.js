//Folder Path: RagnarokOnlineClone/UI/js/systems/combat-system.js
import { calculateHP } from "./hp-system.js";
import { calculateSP } from "./sp-system.js";
import { calculateHPRegen, calculateSPRegen } from "./regen-system.js";
import { calculateWeight } from "./weight-system.js";
import { calculateASPD } from "./aspd-system.js";

// ======================================
// MAIN COMBAT STAT CALCULATIONS
// ===
// ===================================
export function calculateCombatStats(character) {
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
