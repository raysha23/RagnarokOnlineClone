import { initializeElements } from "./ui/ui-elements.js";
import { initializeStats } from "./formulas/stat-formula.js";
import { initializeUIEvents } from "./ui/ui-events.js";
import { updateDescription } from "./ui/ui-updates.js";
import { updateUI } from "./ui/ui-updates.js";
// Application entrypoint
window.addEventListener("DOMContentLoaded", () => {
  initializeElements();
  initializeStats();
  initializeUIEvents();
  updateDescription("novice");
});