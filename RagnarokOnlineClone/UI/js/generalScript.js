document.addEventListener("DOMContentLoaded", function () {
  const maxLevel = 99;
  const levelInput = document.querySelector(".lvl-value-input");
  const statInputs = document.querySelectorAll(".stat-input");
  const plusButtons = document.querySelectorAll(".stat-btn.plus");
  const minusButtons = document.querySelectorAll(".stat-btn.minus");
  const statusPointDisplay = document.querySelector(".status-full input");

  let baseLevel = parseInt(levelInput.value);
  let statusPoints = parseInt(statusPointDisplay.value);

  // =========================
  // LEVEL VALIDATION (MAX 99)
  // =========================
  levelInput.addEventListener("change", function () {   
    let value = parseInt(levelInput.value);

    if (isNaN(value) || value < 1) value = 1;

    if (value > maxLevel) value = maxLevel;

    baseLevel = value;
    levelInput.value = baseLevel;

    sendToCSharp("BaseLevelChanged", {
      baseLevel: baseLevel,
    });
  });

  // =========================
  // STAT BUTTONS
  // =========================
  plusButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      if (statusPoints <= 0) return;

      let statValue = parseInt(statInputs[index].value);
      statValue++;

      statInputs[index].value = statValue;
      statusPoints--;

      updateStatusPoints();
      sendStatsToCSharp();
    });
  });

  minusButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      let statValue = parseInt(statInputs[index].value);

      if (statValue <= 1) return;

      statValue--;
      statInputs[index].value = statValue;
      statusPoints++;

      updateStatusPoints();
      sendStatsToCSharp();
    });
  });

  function updateStatusPoints() {
    statusPointDisplay.value = statusPoints;
  }

  function sendStatsToCSharp() {
    let stats = {
      strength: parseInt(statInputs[0].value),
      agility: parseInt(statInputs[1].value),
      vitality: parseInt(statInputs[2].value),
      intelligence: parseInt(statInputs[3].value),
      dexterity: parseInt(statInputs[4].value),
      luck: parseInt(statInputs[5].value),
      statusPoints: statusPoints,
      baseLevel: baseLevel,
    };

    sendToCSharp("StatsUpdated", stats);
  }

  // =========================
  // WEBVIEW2 COMMUNICATION
  // =========================
  function sendToCSharp(eventType, data) {
    const message = {
      type: eventType,
      payload: data,
    };

    if (window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage(message);
    } else {
      console.log("WebView2 not detected:", message);
    }
  }
});
