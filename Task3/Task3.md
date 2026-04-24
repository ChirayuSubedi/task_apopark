You are given a small parking lot map page in the browser.

Open `map.html` in a browser.

Your goal is to improve the UI and implement interactive spot selection logic.

### What you should implement

Complete the TODOs in:
- `styles.css`
- `map.js`

### Requirements

1. **Improve UI styling**
   - Create a clean app shell with:
     - title
     - legend (`available`, `occupied`, `selected`)
     - summary area
   - Style spot tiles with clear visual states.
   - Add hover feedback for selectable spots.

2. **Implement spot interactions**
   - Clicking an `available` spot toggles selection.
   - `occupied` spots cannot be selected.
   - Maximum selected spots: `3`.
   - If user tries to select more than 3 spots, show an error message.

3. **Update summary**
   - Show:
     - selected count
     - selected spot IDs (comma-separated)
     - total monthly fee (sum of selected spot fees)

4. **Behavior details**
   - Summary updates immediately after each click.
   - Keep rendering logic simple and maintainable.
   - No external frameworks/libraries.

### How to test

1. Open `map.html`.
2. Verify style improvements and visible state differences.
3. Click available spots on/off and check summary updates.
4. Try selecting occupied spots (must do nothing).
5. Try selecting 4 spots (must show error and keep max at 3).

### Constraints

- Use plain HTML/CSS/JavaScript.
- Do not use UI libraries.
