You are given a small Kanban-style ticket board in the browser.

Open `board.html` in a browser.

Your goal is to improve the board styling and implement drag-and-drop ticket movement.

### What you should implement

Complete the TODOs in:
- `styles.css`
- `board.js`

### Requirements

1. **Improve the board UI**
   - Make columns clearly separated cards.
   - Improve ticket card readability and spacing.
   - Add visual feedback while dragging.
   - Add hover/focus states for interactive elements.

2. **Implement drag and drop**
   - Tickets can be dragged between columns:
     - `todo`
     - `inprogress`
     - `done`
   - Reordering inside a column is **not** required.
   - Dropping into a column moves the ticket to that status.

3. **Update counters**
   - Each column header must show current ticket count.
   - Counts update immediately after every move.

4. **Persist board state**
   - Save current ticket statuses to `localStorage`.
   - On page reload, restore the latest saved state.

5. **Behavior details**
   - No external frameworks/libraries.
   - Keep code clean and maintainable.

### How to test

1. Open `board.html`.
2. Verify visual improvements.
3. Drag tickets across columns and check counts.
4. Reload the page and verify state restoration.

### Constraints

- Use plain HTML/CSS/JavaScript.
- Use native HTML5 drag-and-drop APIs.
