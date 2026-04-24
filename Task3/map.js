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

const selectedIds = new Set();

const mapGrid = document.getElementById("mapGrid");
const summary = document.getElementById("summary");
const errorMsg = document.getElementById("errorMsg");

function updateSummary() {
  const selected = spotData.filter((s) => selectedIds.has(s.id));
  const totalFee = selected.reduce((sum, x) => sum + x.monthlyFee, 0);
  const idList = selected.map((x) => x.id).join(", ") || "-";
  summary.textContent = `Selected: ${selected.length} | Spots: ${idList} | Total monthly fee: ${totalFee} EUR`;
}

function handleSpotClick(spot) {
  // TODO:
  // - ignore occupied spots
  // - toggle selection for available spots
  // - enforce maximum of 3 selected spots
  // - write error message if user exceeds limit
  // - re-render + update summary
  void spot;
}

function render() {
  mapGrid.innerHTML = "";
  spotData.forEach((spot) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `spot ${spot.status}`;

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

render();
updateSummary();
