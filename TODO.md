# Fix Skill Page Navigation State Persistence

## Steps:
1. [x] Create this TODO.md
2. [x] Edit main.js: Add explicit call to initializeStats() in the state restoration setTimeout block, after jobLevel update and dispatchEvent('change').
3. [x] Update TODO.md: Mark step 2 complete.
4. [ ] Test: Open home.html, select job/jobLevel, go to skills, go back. Verify stats (HP/SP, ATK etc.) recalculate for job/jobLevel.
5. [ ] If stats still wrong, edit ui-events.js job click handler to always call initializeStats() after job change.
6. [ ] Update TODO.md for any additional changes.
7. [ ] Final test and attempt_completion.

