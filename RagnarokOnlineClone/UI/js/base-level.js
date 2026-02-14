document.addEventListener("DOMContentLoaded", function () {
  const MIN_LEVEL = 1;
  const MAX_LEVEL = 99;
  const MAX_DIGITS = String(MAX_LEVEL).length; // 2 digits for 99
  const STARTING_STATUS_POINTS = 48; // SP at level 1
  const STATUS_POINT_FORMULA = [5, 3, 2]; // lv 2-9:5, 10-49:3, 50-99:2

  const levelInput = document.querySelector(".lvl-value-input");
  const statusPointInput = document.querySelector(".status-full input"); // Status Point input

  // Specifically target Hit Rate and Flee Rate
  const hitRateInput = document.querySelector(
    ".status-columns .column:nth-child(1) .table-row:nth-child(3) input",
  ); // Hit Rate
  const fleeRateInput = document.querySelector(
    ".status-columns .column:nth-child(2) .table-row:nth-child(3) input",
  ); // Flee Rate

  function calculateStatusPoints(level) {
    let points = STARTING_STATUS_POINTS;
    for (let lv = 2; lv <= level; lv++) {
      if (lv <= 9) points += STATUS_POINT_FORMULA[0];
      else if (lv <= 49) points += STATUS_POINT_FORMULA[1];
      else points += STATUS_POINT_FORMULA[2];
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
