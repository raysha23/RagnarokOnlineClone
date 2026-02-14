document.addEventListener("DOMContentLoaded", function () {
  const MIN_LEVEL = 1;
  const MAX_LEVEL = 99;
  const MAX_DIGITS = String(MAX_LEVEL).length; // 2 digits for 99
  const STARTING_STATUS_POINTS = 60; // SP at level 1

  const levelInput = document.querySelector(".lvl-value-input");
  const statusPointInput = document.querySelector(".status-full input"); // Status Point input

  // Specifically target Hit Rate and Flee Rate
  const hitRateInput = document.querySelector(
    ".status-columns .column:nth-child(1) .table-row:nth-child(3) input",
  ); // Hit Rate
  const fleeRateInput = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(3) input",
  ); // Flee Rate
  
  // ✅ Classic Points Gained Per Level
  function getPointsForLevel(level) {
    if (level <= 5) return 3;
    if (level <= 10) return 4;
    if (level <= 15) return 5;
    if (level <= 20) return 6;
    if (level <= 25) return 7;
    if (level <= 30) return 8;
    if (level <= 35) return 9;
    if (level <= 40) return 10;
    if (level <= 45) return 11;
    if (level <= 50) return 12;
    if (level <= 55) return 13;
    if (level <= 60) return 14;
    if (level <= 65) return 15;
    if (level <= 70) return 16;
    if (level <= 75) return 17;
    if (level <= 80) return 18;
    if (level <= 85) return 19;
    if (level <= 90) return 20;
    if (level <= 95) return 21;
    return 22; // 96-99
  }

  function calculateStatusPoints(level) {
    let points = STARTING_STATUS_POINTS;

    for (let lv = 2; lv <= level; lv++) {
      points += getPointsForLevel(lv);
    }

    return points;
  }

  function updateDerivedStats(level) {
    hitRateInput.value = 1 + level; // Hit Rate = 1 + Base Level
    fleeRateInput.value = 1 + level; // Flee Rate = 1 + Base Level
  }

  function updateAll(level) {
    statusPointInput.value = calculateStatusPoints(level);
    updateDerivedStats(level);
  }

  levelInput.addEventListener("input", function (e) {
    let raw = e.target.value.replace(/\D/g, ""); // Remove non-digits

    if (raw.length > MAX_DIGITS) raw = raw.slice(0, MAX_DIGITS);
    raw = raw.replace(/^0+/, "");

    if (raw === "") {
      e.target.value = "";
      updateAll(MIN_LEVEL);
      return;
    }

    let value = Number(raw);
    value = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, value));
    e.target.value = value;

    updateAll(value);
  });

  levelInput.addEventListener("blur", function () {
    let value = Number(levelInput.value);
    if (!Number.isInteger(value) || value < MIN_LEVEL) {
      value = MIN_LEVEL;
      levelInput.value = value;
    }
    updateAll(value);
  });

  // Initialize on page load
  updateAll(Number(levelInput.value));
});
