const rows = [
  { name: "Lena Fischer", department: "Operations", role: "Supervisor", startDate: "2022-01-17", monthlyFee: 120 },
  { name: "Jonas Klein", department: "Finance", role: "Analyst", startDate: "2021-11-03", monthlyFee: 90 },
  { name: "Marta Yilmaz", department: "IT", role: "Developer", startDate: "2023-07-10", monthlyFee: 130 },
  { name: "Ben Weber", department: "Operations", role: "Coordinator", startDate: "2020-04-21", monthlyFee: 80 },
  { name: "Nina Roth", department: "HR", role: "Recruiter", startDate: "2022-09-01", monthlyFee: 95 },
  { name: "Paul Richter", department: "Finance", role: "Controller", startDate: "2020-04-21", monthlyFee: 110 },
  { name: "Sara Novak", department: "IT", role: "QA Engineer", startDate: "2021-02-14", monthlyFee: 100 }
];

const table = document.getElementById("employeeTable");
const tbody = document.getElementById("employeeTableBody");
const headers = Array.from(table.querySelectorAll("th"));

// Tracks which column is currently sorted and in which direction
const state = {
  activeKey: null,
  direction: "asc"
};

function render(data) {
  tbody.innerHTML = data
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.department}</td>
        <td>${item.role}</td>
        <td>${item.startDate}</td>
        <td>${item.monthlyFee}</td>
      </tr>
    `
    )
    .join("");
}

// Type-aware comparator: numeric diff for numbers, Date comparison for dates,
// localeCompare for strings (handles umlauts and special characters correctly)
function compareValues(a, b, type) {
  if (type === "number") return a - b;
  if (type === "date") return new Date(a).getTime() - new Date(b).getTime();
  return String(a).localeCompare(String(b));
}

// Updates ▲/▼ indicators: only the active column gets an arrow, others are reset
function setHeaderIndicators() {
  headers.forEach((th) => {
    const baseLabel = th.textContent.replace(" ▲", "").replace(" ▼", "");
    const key = th.dataset.key;

    if (key === state.activeKey) {
      th.textContent = `${baseLabel} ${state.direction === "asc" ? "▲" : "▼"}`;
    } else {
      th.textContent = baseLabel;
    }
  });
}

// Stable sort with asc/desc toggle:
// - Same key clicked again → flip direction
// - New key clicked → reset to asc
// Stability is preserved by attaching the original index (i) to each row
// and using it as a tiebreaker so equal values keep their relative order
function sortBy(key, type) {
  if (state.activeKey === key) {
    state.direction = state.direction === "asc" ? "desc" : "asc";
  } else {
    state.activeKey = key;
    state.direction = "asc";
  }

  const indexed = rows.map((row, i) => ({ row, i }));
  indexed.sort((a, b) => {
    const cmp = compareValues(a.row[key], b.row[key], type);
    if (cmp !== 0) return state.direction === "asc" ? cmp : -cmp;
    return a.i - b.i; // tiebreaker keeps original order (stable sort)
  });

  setHeaderIndicators();
  render(indexed.map((x) => x.row));
}

// Wire up click handlers only on columns that have data-sortable="true"
// (Role column intentionally has no data-sortable attribute)
headers.forEach((th) => {
  const isSortable = th.dataset.sortable === "true";
  if (!isSortable) return;

  th.style.cursor = "pointer";
  th.addEventListener("click", () => {
    sortBy(th.dataset.key, th.dataset.type);
  });
});

// Initial render with unsorted data
render(rows);
