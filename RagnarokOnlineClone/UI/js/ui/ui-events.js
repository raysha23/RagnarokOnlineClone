//Folder Path: RagnarokOnlineClone/UI/js/ui/ui-events.js
import { elements } from "./ui-elements.js";
import { CharacterImages } from "../data/job-images.js";
import { weaponTypes } from "../data/weapon-data.js";
import { character } from "../state/character.js";
import { updateDescription, updateUI } from "./ui-updates.js";
import { updateLevel, trySetStat } from "../formulas/stat-formula.js";
import { getStatIncreaseCost } from "../formulas/stat-formula.js";

export function initializeUIEvents() {
  const {
    heroImage,
    innateLeftImgs,
    barsCharacter,
    heroSelection,
    jobItems,
    weaponSelect,
    maleBtn,
    femaleBtn,
    levelInput,
  } = elements;

  if (
    !heroImage ||
    !innateLeftImgs ||
    innateLeftImgs.length === 0 ||
    !jobItems
  ) {
    console.error(
      "Essential UI elements for In-game job controls are missing.",
    );
    return;
  }

  const heroes = CharacterImages.heroes;
  const jobIcons = CharacterImages.icons;
  const barsCharacterImages = CharacterImages.bars;
  const heroSelectionImages = CharacterImages.selection;

  let currentGender = "male";

  // ================= HERO IMAGE =================
  function initializeHero(heroName) {
    const hero =
      heroes.find((h) => h.name.toLowerCase() === heroName.toLowerCase()) ||
      heroes[0];

    const job = heroName.toLowerCase();

    // Select main hero image based on gender, with fallback options.
    const heroPaths = [
      `images/${job}${currentGender}.gif`, // e.g. novicefemale.gif
      `images/${currentGender}${job}.gif`, // e.g. femalenovice.gif
      `images/${job}.gif`,
    ];

    const setHeroImage = (index = 0) => {
      if (!heroImage || index >= heroPaths.length) return;
      heroImage.onerror = () => setHeroImage(index + 1);
      heroImage.src = heroPaths[index];
    };

    setHeroImage(0);

    // Set alternate selection images if available
    const selectionPaths = [
      `images/${job}${currentGender}.png`,
      `images/${currentGender}${job}.png`,
      `images/${job}.png`,
    ];

    const setHeroSelection = (index = 0) => {
      if (!heroSelection || index >= selectionPaths.length) return;
      heroSelection.onerror = () => setHeroSelection(index + 1);
      heroSelection.src = selectionPaths[index];
    };

    setHeroSelection(0);

    // Display innate icons list (non-gendered)
    const imgs = hero.innateLeft;
    imgs.forEach((src, i) => {
      if (innateLeftImgs[i]) innateLeftImgs[i].src = src;
    });
  }

  function animateInnates() {
    innateLeftImgs.forEach((img) => {
      img.classList.remove("innate-slide-up");
      void img.offsetWidth;
      img.classList.add("innate-slide-up");
    });
  }

  // ================= BARS CHARACTER =================
  function setBarsCharacter(job) {
    if (!barsCharacter) return;

    const gender = currentGender;
    const paths = [];

    // Primary pattern: images/{job}Bar{gender}.png (e.g. swordsmanBarfemale.png)
    paths.push(`images/${job}Bar${gender}.png`);

    // fallback to existing bar map from job-images.js (if still present)
    if (barsCharacterImages[job]) paths.push(barsCharacterImages[job]);

    let index = 0;
    const trySet = () => {
      if (index >= paths.length) return;
      barsCharacter.onerror = () => {
        index += 1;
        trySet();
      };
      barsCharacter.src = paths[index];
    };

    trySet();
  }

  // ================= WEAPON DROPDOWN =================
  function updateWeaponDropdown(job, keepCurrent = true) {
    if (!weaponSelect) return;

    const currentWeapon = weaponSelect.value;
    weaponSelect.innerHTML = "";

    const weapons = weaponTypes[job];
    if (!weapons) return;

    weapons.forEach((weapon) => {
      const option = document.createElement("option");
      option.value = weapon.toLowerCase();
      option.textContent = weapon;
      weaponSelect.appendChild(option);
    });

    // Restore previous weapon if it exists
    if (
      keepCurrent &&
      weapons.map((w) => w.toLowerCase()).includes(currentWeapon)
    ) {
      weaponSelect.value = currentWeapon;
      character.weapon = currentWeapon;
    } else {
      weaponSelect.selectedIndex = 0;
      character.weapon = weaponSelect.value;
    }
  }

  if (weaponSelect) {
    weaponSelect.addEventListener("change", (e) => {
      character.weapon = e.target.value;
      updateUI();
    });
  }

  // ================= BASE LEVEL INPUT =================
  if (levelInput) {
    const applyBaseLevel = (value) => {
      const normalized = Math.max(1, Math.min(99, value));
      character.baseLevel = normalized;
      updateLevel(normalized); // updates availablePoints and triggers updateUI()
    };

    const onLevelInputChanged = (e) => {
      const value = parseInt(e.target.value, 10);
      if (!Number.isNaN(value)) {
        applyBaseLevel(value);
      }
    };

    levelInput.addEventListener("input", onLevelInputChanged);
    levelInput.addEventListener("change", onLevelInputChanged);
  }

  // ================= STAT POINT CONTROLS =================
  const statKeys = ["str", "agi", "vit", "int", "dex", "luk"];

  statKeys.forEach((statName) => {
    const row = elements.statRows[statName];
    if (!row) return;

    const plusBtn = row.querySelector(".stat-btn.plus");
    const minusBtn = row.querySelector(".stat-btn.minus");
    const statInput = row.querySelector(".stat-input");

    const sanitizeAndSet = (value) => {
      let statValue = parseInt(value, 10);
      if (Number.isNaN(statValue)) return;

      const current = character.stats[statName];
      let pointsLeft = character.availablePoints;

      let maxAffordable = current;
      while (maxAffordable < 99) {
        const cost = getStatIncreaseCost(maxAffordable);
        if (pointsLeft >= cost) {
          pointsLeft -= cost;
          maxAffordable++;
        } else {
          break;
        }
      }

      statValue = Math.max(1, Math.min(statValue, maxAffordable));

      trySetStat(statName, statValue);
      statInput.value = statValue;
    };

    plusBtn?.addEventListener("click", () => {
      sanitizeAndSet(character.stats[statName] + 1);
    });
    minusBtn?.addEventListener("click", () => {
      sanitizeAndSet(character.stats[statName] - 1);
    });

    if (statInput) {
      statInput.addEventListener("input", (e) => {
        let digits = e.target.value.replace(/\D/g, "");
        e.target.value = digits;
        if (digits !== "") sanitizeAndSet(digits);
      });
      statInput.addEventListener("change", (e) => {
        sanitizeAndSet(e.target.value);
      });
    }
  });

  // ================= JOB SELECTION =================
  jobItems.forEach((item) => {
    item.addEventListener("click", () => {
      const job = item.dataset.job.toLowerCase();

      updateWeaponDropdown(job, false); // keep current weapon if possible

      jobItems.forEach((i) => {
        i.classList.remove("active");
        const icon = i.querySelector(".job-icon");
        if (icon) {
          const j = i.dataset.job.toLowerCase();
          icon.src = jobIcons[j].inactive;
        }
      });

      item.classList.add("active");
      const icon = item.querySelector(".job-icon");
      if (icon) icon.src = jobIcons[job].active;

      character.job = job;
      character.weapon = weaponSelect.value;

      setBarsCharacter(job);

      if (heroSelection && heroSelectionImages[job])
        heroSelection.src = heroSelectionImages[job];

      updateUI();
      initializeHero(job);
      animateInnates();
      updateDescription(job);
    });
  });

  // ================= GENDER BUTTONS =================
  if (maleBtn && femaleBtn) {
    const switchGender = (gender) => {
      currentGender = gender;
      maleBtn.src =
        gender === "male" ? "images/maleactive.png" : "images/maleinactive.png";
      femaleBtn.src =
        gender === "female"
          ? "images/femaleactive.png"
          : "images/femaleinactive.png";

      const activeJobItem = document.querySelector(".job-item.active");
      if (activeJobItem) {
        const job = activeJobItem.dataset.job.toLowerCase();
        initializeHero(job); // update hero image & innates
        setBarsCharacter(job); // update gender-specific bar character
        updateWeaponDropdown(job, true); // keep current weapon if valid
      }
    };

    maleBtn.addEventListener("click", () => switchGender("male"));
    femaleBtn.addEventListener("click", () => switchGender("female"));
  }

  // ================= DEFAULT JOB =================
  const defaultJob = "novice";
  const defaultJobItem = Array.from(jobItems).find(
    (item) => item.dataset.job === defaultJob,
  );

  if (defaultJobItem) defaultJobItem.click();
  else updateWeaponDropdown(defaultJob);
}
