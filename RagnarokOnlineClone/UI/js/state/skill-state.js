// File: RagnarokOnlineClone/UI/js/state/skill-state.js
// ================= STATE =================
export const state = {
  skillPointsUsed: 0,
  skillPointsLeft: 0,
  characterSkillLevels: {},
};

// ================= RESET =================
export function resetState() {
  state.skillPointsUsed = 0;
  state.skillPointsLeft = 0;
  state.characterSkillLevels = {};
}

// ================= INCREMENT =================
export function incrementSkill(skillKey, maxLv) {
  const current = state.characterSkillLevels[skillKey] || 0;

  if (state.skillPointsLeft > 0 && current < maxLv) {
    state.characterSkillLevels[skillKey] = current + 1;
    state.skillPointsUsed++;
    state.skillPointsLeft--;
    return true;
  }

  return false;
}


export function saveSkillState(job) {
  const data = {
    skills: state.characterSkillLevels,
    pointsUsed: state.skillPointsUsed,
  };

  localStorage.setItem(`skillState_${job}`, JSON.stringify(data));
}

export function loadSkillState(job) {
  const saved = localStorage.getItem(`skillState_${job}`);
  if (!saved) return;

  const data = JSON.parse(saved);

  state.characterSkillLevels = data.skills || {};
  // Calculate total used points from loaded skills
  const total = Object.values(state.characterSkillLevels).reduce((sum, level) => sum + level, 0);
  state.skillPointsUsed = total;
}
export function recalculatePointsUsed() {
  let total = 0;

  Object.values(state.characterSkillLevels).forEach(level => {
    total += level;
  });

  state.pointsUsed = total;
}