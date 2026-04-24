You are given a small browser page with an employee parking table.

Open `table.html` in a browser.

Your goal is to improve the table UI with CSS and add client-side sorting behavior.

### What you should implement

In this task, complete the TODOs in:
- `styles.css`
- `table.js`

### Requirements

1. **Make the table look clean and readable**
   - Add a card-like container.
   - Improve spacing, typography, and row separators.
   - Add alternating row colors and a hover state.
   - Make the header visually distinct.

2. **Set sensible column widths**
   - Name: `28%`
   - Department: `22%`
   - Role: `28%`
   - Start Date: `12%`
   - Monthly Fee: `10%`

3. **Add sorting**
   - Clicking a sortable header toggles sorting `asc -> desc -> asc`.
   - Sortable columns: `Name`, `Department`, `Start Date`, `Monthly Fee`.
   - Sorting by date must use actual date values (`YYYY-MM-DD`).
   - Sorting by fee must be numeric.
   - Show sort direction in the header (`▲` / `▼`) for the active column.

4. **Behavior details**
   - Keep sorting stable (when values are equal, keep original relative order).
   - No external frameworks/libraries.
   - Keep the markup structure simple and semantic.

### How to test

1. Open `table.html`.
2. Confirm the table is visually improved.
3. Click each sortable header multiple times:
   - Verify asc/desc toggling.
   - Verify values are sorted correctly.
4. Confirm non-sortable column (`Role`) does not trigger sorting.

### Constraints

- Use plain HTML/CSS/JavaScript.
- Do not use built-in table plugins.
- Keep code readable and maintainable.
