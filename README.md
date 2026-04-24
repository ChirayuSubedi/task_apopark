# Implementation Notes

**Applicant:** Chirayu Subedi  
**Date:** April 2026  
**Repository:** [github.com/ChirayuSubedi/task_apopark.git](https://github.com/ChirayuSubedi/task_apopark.git)

---

## Overview

All three tasks are implemented in plain HTML, CSS, and JavaScript — no frameworks, no build step, no external libraries. Each task folder is self-contained and opens directly in the browser.

---

## Task 1 — Sortable Employee Table

**Files changed:** `styles.css`, `table.js`

### CSS (`styles.css`)

| Change | Reason |
|--------|--------|
| `box-sizing: border-box` on `*` | Industry standard; ensures padding and borders are included in element dimensions rather than added on top |
| Column widths via `nth-child` | `table-layout: fixed` was already set; `nth-child` is the correct selector for fixed-layout tables |
| Widths: Name 28%, Dept 22%, Role 28%, Date 12%, Fee 10% | As specified in the requirements |
| Zebra striping (`tbody tr:nth-child(even)`) | Makes rows easier to track visually across wide tables |
| Row hover (`tbody tr:hover`) | Blue tint gives immediate feedback on which row the user is on |
| `user-select: none` on sortable headers | Prevents accidental text selection on repeated clicks |
| Hover state on sortable headers | Darker grey background signals the header is clickable |
| `text-align: right` on the fee column | Standard typographic convention for numeric/currency columns |

### JavaScript (`table.js`)

| Change | Reason |
|--------|--------|
| Currency symbol `€` in fee cells | Raw numbers without a unit are ambiguous; `€` makes the column self-explanatory |
| `sortBy()` implemented | Core sorting logic was the primary TODO |
| Same-key click toggles direction | Standard sort UX: asc → desc → asc |
| New-key click resets to asc | Users expect a fresh sort to start ascending |
| Stable sort via index tiebreaker | Original relative order is preserved when values are equal (e.g. two employees with the same start date) |
| `localeCompare` for string comparison | Handles German umlauts and special characters correctly |
| Date comparison using `Date.getTime()` | Comparing raw ISO strings lexicographically would also work here, but `.getTime()` is explicit and correct |

### Key decision: stable sort
JavaScript's `Array.prototype.sort` is stable in all modern browsers (V8 ≥ 7.0, Firefox, Safari). However, the stable guarantee only holds when the comparator is consistent. To make stability explicit and clear, each row is tagged with its original array index before sorting, and that index is used as a tiebreaker when the primary comparison returns zero.

---

## Task 2 — Kanban Ticket Board (Drag and Drop)

**Files changed:** `styles.css`, `board.js`

### CSS (`styles.css`)

| Change | Reason |
|--------|--------|
| `cursor: grab` on `.ticket` | Immediately signals that cards are draggable |
| `transition` on `box-shadow` and `opacity` | Smooth visual transitions for hover and drag states |
| Shadow lift on `.ticket:hover` | Reinforces draggability before the user starts dragging |
| `.ticket.dragging { opacity: 0.35 }` | The source card fades to show it is "in flight" |
| `cursor: grabbing` while dragging | Browser cursor confirms active drag state |
| Small muted ticket ID label | Visual hierarchy: ID is metadata, title is primary content |
| `.dropzone.drag-over` with dashed blue border | Immediately communicates which column is the valid drop target |

### JavaScript (`board.js`)

| Change | Reason |
|--------|--------|
| `dragstart` sets `draggedTicketId` + adds `.dragging` class | Module-level variable avoids DataTransfer payloads; one card at a time |
| `dragend` always clears state | Handles Escape/cancelled drags correctly, not just successful drops |
| `dragenter` counter approach for highlight | Fixes flicker bug: `dragleave` fires when the cursor moves from the dropzone into a child ticket element. A per-zone `enterCount` counter increments on `dragenter` and decrements on `dragleave` — the highlight is only removed when the counter reaches 0, meaning the cursor has truly left the zone |
| `dragover` calls `preventDefault()` only | Required by the HTML5 DnD spec to allow dropping; highlight logic moved to `dragenter`/`dragleave` |
| `drop` resets `enterCount` to 0 | Ensures the counter is clean for the next drag even if `dragleave` didn't fire |
| `drop` updates `ticket.status`, calls `saveTickets()`, re-renders | Single clear action: mutate → persist → reflect |
| `setupDropzones()` called once before `render()` | Dropzone listeners survive re-renders because `render()` only rewrites the dropzone's innerHTML, not the dropzone element itself |
| `localStorage` persistence with versioned key | State survives page reload; versioned key avoids conflicts with stale saved data from a previous schema |

### Key decision: `dragenter` counter vs. `dragover` for highlight
Using `dragover` to add the `.drag-over` class works most of the time but causes visible flicker: when the cursor moves from the dropzone into a child ticket element, `dragleave` fires on the dropzone (removing the class) before `dragover` fires again (re-adding it). The `dragenter`/`dragleave` counter approach is flicker-free because the class is only removed when `enterCount` reaches 0 — which only happens when the cursor has genuinely left the entire zone.

### Key decision: module-level drag variable vs. DataTransfer
The HTML5 `DataTransfer` API could store the ticket ID as a string. Using a module-level `draggedTicketId` variable instead is simpler to read and avoids the overhead of serialising/deserialising the ID on every drag event. Since only one drag can be active at a time, there is no concurrency concern.

---

## Task 3 — Parking Lot Selector

**Files changed:** `styles.css`, `map.js`

### CSS (`styles.css`)

| Change | Reason |
|--------|--------|
| `.chip` colours match spot tile colours | Legend and tiles share the same colour palette — no mismatch |
| `.spot.available` green tint | Available = open = go → green is the universally understood signal |
| `.spot.occupied` red tint + `cursor: not-allowed` + `opacity: 0.7` | Three visual cues reinforce the same message: this spot cannot be selected |
| `.spot.selected` blue tint | Blue is a standard "selected/active" colour that doesn't conflict with the status colours |
| `transition` on `box-shadow` and `background` | Smooth colour change makes selection feel responsive without being distracting |
| `.spot.available:hover` deeper green + shadow | Signals the click will select the spot |
| `.spot.selected:hover` deeper blue | Signals the click will deselect rather than select |
| `min-height: 20px` on `.error` | Reserves vertical space so the layout does not shift when the error appears or disappears |

### JavaScript (`map.js`)

| Change | Reason |
|--------|--------|
| `localStorage` persistence via `saveSelection()` / `loadSelection()` | Selection survives page reload; `loadSelection()` validates restored IDs against current `spotData` to guard against stale data |
| `handleSpotClick()` implemented | Core interaction logic: ignore occupied → toggle selected → enforce max 3 |
| Early return for `occupied` spots | No selection change, no re-render, no error — occupied tiles are purely informational |
| Toggle deselect on second click | Standard selection pattern; deselect clears the error message too |
| Guard at `selectedIds.size >= 3` | Shows error and returns without adding the spot or re-rendering |
| `Set` for `selectedIds` | O(1) add/delete/has vs. O(n) for an array; also prevents duplicates naturally |
| `updateSummary()` derives values from `selectedIds` each time | No separate counter state to keep in sync |

### Key decision: full re-render on each click
With 10 spots the performance impact is negligible. A full `render()` call on every interaction keeps the logic simple: `selectedIds` is the single source of truth, and the DOM always reflects it completely. A partial DOM-update approach (toggling classes in place) would be marginally faster but harder to reason about and more error-prone.

### Key decision: localStorage validation on load
When restoring selection from localStorage, each saved ID is checked against `spotData` and filtered to only `available` spots. This prevents a scenario where a previously selected spot has since become `occupied` and would re-render as selected despite being unavailable.

---

## What I would improve with more time

### Task 1 — Table

- **Keyboard sorting** — sortable headers should respond to Enter and Space, not just mouse clicks
- **`aria-sort` attribute** — screen readers cannot announce sort direction without it
- **`:focus-visible` ring** — keyboard users need a visible focus indicator on headers
- **Responsive fallback** — the table needs a minimum width and horizontal scroll on narrow screens
- **Multi-column sort** — Shift+click to add a secondary sort key, standard in data-heavy admin tools

### Task 2 — Board

- **Touch support** — native HTML5 drag-and-drop does not fire on iOS or Android; a Pointer Events fallback is needed for mobile
- **Priority colour badges** — high=red, medium=amber, low=green makes priority scannable at a glance (the data is already in the ticket object)
- **Keyboard card movement** — Tab to focus a card, arrow keys to move it between columns
- **Empty column placeholder** — "Drop tickets here" when a column is empty clarifies valid drop targets
- **Undo last move** — a single state snapshot would enable Ctrl+Z

### Task 3 — Parking Map

- **Keyboard navigation** — `<button>` elements are already keyboard-focusable; explicit `:focus-visible` styles would complete accessibility
- **"Clear selection" button** — currently the only way to deselect all is clicking each spot individually
- **Tooltip on hover** — spot ID + fee + zone label without needing to read the summary
- **Zone/row labels** — grouping spots visually (Zone A, Zone B) mirrors real parking maps

---

## General notes

- No external libraries or build tools were used in any task.
- All logic follows a simple pattern: update state → persist → re-render → update derived UI.
- Comments in the code explain *why* decisions were made, not just *what* the code does.
