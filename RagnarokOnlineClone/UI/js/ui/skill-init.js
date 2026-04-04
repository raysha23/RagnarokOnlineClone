// File Path: js/ui/skill-init.js
import { loadSkillState, recalculatePointsUsed } from "../state/skill-state.js";
import {
  skillData,
  skillInfo,
  characterImages,
  characterMessages,
  skillTreeTitles,
} from "../data/skill-data.js";
import { state, resetState } from "../state/skill-state.js";
import {
  populateJobLevels,
  updatePoints,
  typeMessage,
} from "../systems/skill-utils.js";
import { renderSkills } from "../ui/skill-renderer.js";

export function init() {
  const classIcons = document.querySelectorAll(".class-icons img");
  const heroImage = document.getElementById("heroImage");
  const heroShadow = document.getElementById("heroShadow");
  const messageText = document.querySelector(".message-text");
  const skillTreeTitle = document.querySelector(".skill-tree-title");

  const jobLevelSelect = document.getElementById("jobLevel");
  const skillTreeArea = document.querySelector(".skill-tree-area");
  const skillCard = document.querySelector(".ro-skill-card");
  const pointsLeftInput = document.getElementById("pointsLeft");
  const pointsUsedInput = document.getElementById("pointsUsed");

  // ================= AUTO ALLOCATE =================
  function autoAllocateSkills(maxPoints) {
    let usedPoints = 0;
    let progress = true;

    while (progress && usedPoints < maxPoints) {
      progress = false;

      for (const skillKey in state.characterSkillLevels) {
        const info = skillInfo[skillKey];
        if (!info) continue;

        const currentLv = state.characterSkillLevels[skillKey];
        const maxLv = info.maxLv || 10;

        if (currentLv >= maxLv) continue;

        const reqs = info.req || [];

        const canLevel = reqs.every(
          (r) => (state.characterSkillLevels[r.skill] || 0) >= r.lv
        );

        if (!canLevel) continue;

        if (usedPoints >= maxPoints) break;

        state.characterSkillLevels[skillKey]++;
        usedPoints++;

        progress = true;
      }
    }

    state.skillPointsUsed = usedPoints;
    state.skillPointsLeft = maxPoints - usedPoints;
  }

  function resetAllSkills() {
    for (let key in state.characterSkillLevels) {
      state.characterSkillLevels[key] = 0;
    }
  }

  // ================= JOB LEVEL =================
  populateJobLevels(jobLevelSelect, 1, 50);

  let previousJobLevel = parseInt(jobLevelSelect.value) || 1;

  jobLevelSelect.addEventListener("change", () => {
    const jobLevel = parseInt(jobLevelSelect.value);
    const maxPoints = jobLevel - 1;

    const isDecreasing = jobLevel < previousJobLevel;

    if (isDecreasing) {
      // ✅ AUTO ONLY WHEN LOWERING
      resetAllSkills();

      state.skillPointsUsed = 0;
      state.skillPointsLeft = maxPoints;

      autoAllocateSkills(maxPoints);
    } else {
      // ✅ NO AUTO WHEN INCREASING
      state.skillPointsLeft = maxPoints - state.skillPointsUsed;
    }

    updatePoints(jobLevelSelect, state, pointsLeftInput, pointsUsedInput);

    const activeIcon = document.querySelector(".class-icons img.active");
    const activeChar = activeIcon ? activeIcon.dataset.character : "novice";

    renderSkills(activeChar, {
      skillTreeArea,
      skillCard,
      jobLevelSelect,
      pointsLeftInput,
      pointsUsedInput,
    });

    previousJobLevel = jobLevel;
  });

  // ================= HERO =================
  let currentGender = "male";

  function updateHeroImages(charName) {
    if (currentGender === "male") {
      heroImage.src = characterImages[charName].hero;
      heroShadow.src = characterImages[charName].shadow;
    } else {
      heroImage.src = characterImages[charName].femaleHero;
      heroShadow.src = characterImages[charName].femaleShadow;
    }
  }

  function updateSkillTreeTitle(title) {
    skillTreeTitle.style.opacity = 0;
    setTimeout(() => {
      skillTreeTitle.textContent = title;
      skillTreeTitle.style.opacity = 1;
    }, 300);
  }

  // ================= INIT =================
  const urlParams = new URLSearchParams(window.location.search);
  const selectedJob = urlParams.get("job") || "novice";
  currentGender = urlParams.get("gender") || "male";
  
  const urlJobLevel = parseInt(urlParams.get("jobLevel"), 10);
  const initialJobLevel = !isNaN(urlJobLevel)
  ? Math.max(1, Math.min(50, urlJobLevel))
  : 50;
  
  loadSkillState(selectedJob);
  updatePoints(jobLevelSelect, state, pointsLeftInput, pointsUsedInput);
  // renderSkills(selectedJob, elements);
  if (jobLevelSelect) jobLevelSelect.value = initialJobLevel;


  previousJobLevel = initialJobLevel;

  const maleBtn = document.getElementById("maleBtn");
  const femaleBtn = document.getElementById("femaleBtn");

  maleBtn.src =
    currentGender === "male"
      ? "images/maleactive.png"
      : "images/maleinactive.png";

  femaleBtn.src =
    currentGender === "female"
      ? "images/femaleactive.png"
      : "images/femaleinactive.png";

  // ================= CLASS SELECT =================
  classIcons.forEach((icon) => {
    const charName = icon.dataset.character;

    if (charName === selectedJob) {
      icon.src = characterImages[charName].active;
      icon.classList.add("active");

      updateHeroImages(charName);
      typeMessage(messageText, characterMessages[charName]);
      updateSkillTreeTitle(skillTreeTitles[charName]);

      renderSkills(charName, {
        skillTreeArea,
        skillCard,
        jobLevelSelect,
        pointsLeftInput,
        pointsUsedInput,
      });
    } else {
      icon.src = characterImages[charName].inactive;
    }

    icon.addEventListener("click", () => {
      resetState();

      jobLevelSelect.value = 50;
      previousJobLevel = 50;

      state.skillPointsUsed = 0;
      state.skillPointsLeft = 49;

      updatePoints(jobLevelSelect, state, pointsLeftInput, pointsUsedInput);

      classIcons.forEach(
        (i) => (i.src = characterImages[i.dataset.character].inactive)
      );

      icon.src = characterImages[charName].active;

      document
        .querySelector(".class-icons img.active")
        ?.classList.remove("active");

      icon.classList.add("active");

      updateHeroImages(charName);
      typeMessage(messageText, characterMessages[charName]);
      updateSkillTreeTitle(skillTreeTitles[charName]);

      renderSkills(charName, {
        skillTreeArea,
        skillCard,
        jobLevelSelect,
        pointsLeftInput,
        pointsUsedInput,
      });
    });
  });

  // ================= GENDER =================
  maleBtn.addEventListener("click", () => {
    maleBtn.src = "images/maleactive.png";
    femaleBtn.src = "images/femaleinactive.png";
    currentGender = "male";

    updateHeroImages(
      document.querySelector(".class-icons img.active").dataset.character
    );
  });

  femaleBtn.addEventListener("click", () => {
    femaleBtn.src = "images/femaleactive.png";
    maleBtn.src = "images/maleinactive.png";
    currentGender = "female";

    updateHeroImages(
      document.querySelector(".class-icons img.active").dataset.character
    );
  });

  // 1. Helper function to handle the modal logic
  function showGoldConfirm(message) {
    return new Promise((resolve) => {
      const modal = document.getElementById("goldModal");
      const confirmBtn = document.getElementById("modalConfirm");
      const cancelBtn = document.getElementById("modalCancel");
      const msgEl = document.getElementById("modalMessage");

      msgEl.textContent = message;
      modal.style.display = "flex";

      const handleConfirm = () => {
        cleanup();
        resolve(true);
      };

      const handleCancel = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        modal.style.display = "none";
        confirmBtn.removeEventListener("click", handleConfirm);
        cancelBtn.removeEventListener("click", handleCancel);
      };

      confirmBtn.addEventListener("click", handleConfirm);
      cancelBtn.addEventListener("click", handleCancel);
    });
  }

  // 2. Updated RESET Logic
  const btn = document.getElementById("resetSkills");

  if (btn) {
    btn.addEventListener("click", async (e) => { // Added 'async'
      e.preventDefault();

      // Use our custom Gold Modal instead of confirm()
      const confirmed = await showGoldConfirm("Reset all skill points?");

      if (confirmed) {
        resetState();

        updatePoints(jobLevelSelect, state, pointsLeftInput, pointsUsedInput);

        const activeIcon = document.querySelector(".class-icons img.active");
        const activeChar = activeIcon ? activeIcon.dataset.character : "novice";

        if (skillTreeArea) skillTreeArea.innerHTML = "";

        renderSkills(activeChar, {
          skillTreeArea,
          skillCard,
          jobLevelSelect,
          pointsLeftInput,
          pointsUsedInput,
        });
      }
    });
  }
}
// =======================================
// Skill Card Pop-up beside Skill Node
// =======================================
function attachSkillCardHover(skillTreeArea, skillCard) {
  // Ensure card is absolutely positioned via CSS
  skillCard.classList.add("skill-card"); // Add a class for CSS control
  skillCard.style.pointerEvents = "none"; // Don't block mouse
  skillCard.style.display = "none"; // Hide initially

  skillTreeArea.querySelectorAll(".skill-node").forEach((skillEl) => {
    skillEl.addEventListener("mouseenter", () => {
      const skillKey = skillEl.dataset.skillKey;
      const info = skillInfo[skillKey];
      if (!info) return;

      // Update content
      skillCard.querySelector(".header-main h2").innerHTML =
        `${info.title} <span class="skill-id">${info.id}</span>`;
      skillCard.querySelector(".skill-stats").innerHTML = `
        <tr><th>Type</th><td>${info.type}</td><th>Max Lv</th><td>${info.maxLv}</td></tr>
        <tr><th>Effect</th><td colspan="3">${info.effect || "No description"}</td></tr>
      `;

      skillCard.style.display = "flex"; // Show card
      skillCard.classList.add("show");
    });

    skillEl.addEventListener("mouseleave", () => {
      skillCard.style.display = "none"; // Hide card
      skillCard.classList.remove("show");
    });
  });
}