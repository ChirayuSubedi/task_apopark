const spotData = [
  { id: "P-01", status: "available", monthlyFee: 85 },
  { id: "P-02", status: "occupied", monthlyFee: 90 },
  { id: "P-03", status: "available", monthlyFee: 95 },
  { id: "P-04", status: "available", monthlyFee: 88 },
  { id: "P-05", status: "occupied", monthlyFee: 92 },
  { id: "P-06", status: "available", monthlyFee: 80 },
  { id: "P-07", status: "available", monthlyFee: 86 },
  { id: "P-08", status: "occupied", monthlyFee: 91 },
  { id: "P-09", status: "available", monthlyFee: 89 },
  { id: "P-10", status: "available", monthlyFee: 87 }
];

// Set gives O(1) lookup for selection checks during render
const selectedIds = new Set();

const SELECTION_KEY = "task3-parking-selection-v1";

const mapGrid = document.getElementById("mapGrid");
const summary = document.getElementById("summary");
const errorMsg = document.getElementById("errorMsg");

// Persist current selection so it survives page reload
function saveSelection() {
  localStorage.setItem(SELECTION_KEY, JSON.stringify([...selectedIds]));
}

// Restore selection from localStorage on startup.
// Only restores IDs that still exist in spotData and are still available —
// guards against stale data if the spot list changes between sessions.
function loadSelection() {
  const raw = localStorage.getItem(SELECTION_KEY);
  if (!raw) return;
  try {
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return;
    ids.forEach((id) => {
      const spot = spotData.find((s) => s.id === id);
      if (spot && spot.status === "available") selectedIds.add(id);
    });
  } catch (_err) {
    // Corrupt data — start fresh with an empty selection
  }
}

// Derives summary values from selectedIds + spotData each time — no separate state to sync
function updateSummary() {
  const selected = spotData.filter((s) => selectedIds.has(s.id));
  const totalFee = selected.reduce((sum, x) => sum + x.monthlyFee, 0);
  const idList = selected.map((x) => x.id).join(", ") || "-";
  summary.textContent = `Selected: ${selected.length} | Spots: ${idList} | Total monthly fee: ${totalFee} EUR`;
}

// Handles all three interaction rules in one place:
// 1. Occupied spots are always ignored
// 2. Already-selected spots are deselected (toggle)
// 3. New selection is blocked if the maximum of 3 is already reached
function handleSpotClick(spot) {
  if (spot.status === "occupied") return;

  if (selectedIds.has(spot.id)) {
    selectedIds.delete(spot.id);
    errorMsg.textContent = ""; // clear any previous limit warning on deselect
  } else {
    if (selectedIds.size >= 3) {
      errorMsg.textContent = "You can select at most 3 spots.";
      return; // early return: don't add the spot or re-render
    }
    selectedIds.add(spot.id);
    errorMsg.textContent = "";
  }

  saveSelection();
  render();
  updateSummary();
}

// Full re-render on each interaction. Simple and correct for this data size.
// The selected class is applied based on selectedIds, which is the single source of truth.
function render() {
  mapGrid.innerHTML = "";
  spotData.forEach((spot) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `spot ${spot.status}`;

    // Apply selected class on top of status class so CSS can combine them
    if (selectedIds.has(spot.id)) {
      btn.classList.add("selected");
    }

    btn.innerHTML = `
      <strong>${spot.id}</strong>
      <div>${spot.monthlyFee} EUR</div>
    `;

    btn.addEventListener("click", () => handleSpotClick(spot));
    mapGrid.appendChild(btn);
  });
}

// Restore any previously saved selection before the first render
loadSelection();
render();
updateSummary();
