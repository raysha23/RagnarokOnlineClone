//Folder Path: RagnarokOnlineClone/UI/js/ui/ui-updates.js
import { elements } from "./ui-elements.js";
import { character } from "../state/character.js";
import { jobData } from "../data/job-data.js";
import { calculateCombatStats } from "../systems/combat-system.js";
import { getStatIncreaseCost } from "../formulas/stat-formula.js";

// ======================================================
// MAIN UI UPDATE
// ======================================================

export function updateUI() {
  // const combatStats = calculateCombatStats(character);
  character.calcStats = calculateCombatStats(character);

  // ================= STATS =================

  if (elements.attackInput) elements.attackInput.value = character.calcStats.attack;
  if (elements.MinmagicAttackInput)
    elements.MinmagicAttackInput.value = character.calcStats.matkMin;
  if (elements.MaxmagicAttackInput)
    elements.MaxmagicAttackInput.value = character.calcStats.matkMax;
  if (elements.critInput) elements.critInput.value = character.calcStats.crit;
  if (elements.defenseInput) elements.defenseInput.value = character.calcStats.defense;
  if (elements.magicDefenseInput)
    elements.magicDefenseInput.value = character.calcStats.mdefBase;
  if (elements.attackSpeedInput)
    elements.attackSpeedInput.value = character.calcStats.attackSpeed;
  if (elements.hitRateInput) elements.hitRateInput.value = character.calcStats.hit;
  // ================= FLEE =================
  if (elements.fleeBaseInput) elements.fleeBaseInput.value = character.calcStats.flee;

  // ================= LEVEL =================
  if (elements.levelInput) elements.levelInput.value = character.baseLevel;
  if (elements.statusPointInput)
    elements.statusPointInput.value = character.availablePoints;
    console.log("STATS:", character.stats);
    console.log("CALC:", character.calcStats);
  // ================= STAT ROWS =================

  const statOrder = ["str", "agi", "vit", "int", "dex", "luk"];

  statOrder.forEach((statName, index) => {
    const row = elements.statRows && elements.statRows[statName];
    if (!row) return; // skip if UI for stat row not present on this page

    const input = row.querySelector(".stat-input");
    const plusBtn = row.querySelector(".stat-btn.plus");
    const minusBtn = row.querySelector(".stat-btn.minus");

    const value = character.stats[statName];
    const cost = getStatIncreaseCost(value);

    if (input) input.value = value;

    if (elements.ptsReqDisplays && elements.ptsReqDisplays[index]) {
      elements.ptsReqDisplays[index].textContent = cost;
    }

    if (plusBtn) plusBtn.disabled = value >= 99 || character.availablePoints < cost;
    if (minusBtn) minusBtn.disabled = value <= 1;
  });

  // ================= HP / SP =================
  const maxHP = character.calcStats.maxHP;
  const maxSP = character.calcStats.maxSP;

  // Using the bar-row and classes to target HP
  const hpFill = document.querySelector(".bar-row .hp-fill");
  const hpRow = hpFill ? hpFill.closest(".bar-row") : null;
  const hpText = hpRow ? hpRow.querySelector(".bar-text-input") : null;
  if (hpText) {
    hpText.value = `${maxHP.toLocaleString()} / ${maxHP.toLocaleString()}`;
  }

  // Using the bar-row and classes to target SP
  const spFill = document.querySelector(".bar-row .sp-fill");
  const spRow = spFill ? spFill.closest(".bar-row") : null;
  const spText = spRow ? spRow.querySelector(".bar-text-input") : null;
  if (spText) {
    spText.value = `${maxSP.toLocaleString()} / ${maxSP.toLocaleString()}`;
  }

  // ================= REGEN =================

  const weightEl = document.querySelector(".weight-box");

  if (weightEl) weightEl.textContent = character.calcStats.weightLimit;

  const hpRegenEl = document.querySelector(".hp-regen-value");

  if (hpRegenEl) hpRegenEl.textContent = character.calcStats.hpRegen;

  const spRegenEl = document.querySelector(".sp-regen-value");

  if (spRegenEl) spRegenEl.textContent = character.calcStats.spRegen;
}

// ======================================================
// DESCRIPTION UPDATE
// ======================================================

export function updateDescription(job) {
  if (!elements.jobTitle || !elements.descText || !jobData[job]) return;

  elements.jobTitle.style.opacity = 0;
  elements.descText.style.opacity = 0;

  setTimeout(() => {
    elements.jobTitle.innerText = job.toUpperCase();

    elements.descText.innerText = jobData[job].description;

    elements.jobTitle.style.opacity = 1;
    elements.descText.style.opacity = 1;
  }, 200);
}
