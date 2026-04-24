// Storage key is versioned so stale data from an older schema doesn't break the board
const STORAGE_KEY = "task6-ticket-board-v1";

const defaultTickets = [
  { id: "T-100", title: "Broken barrier in Zone B", priority: "high", status: "todo" },
  { id: "T-101", title: "Refund request for duplicate charge", priority: "medium", status: "todo" },
  { id: "T-102", title: "Camera stream lagging", priority: "high", status: "inprogress" },
  { id: "T-103", title: "Update signage in entrance", priority: "low", status: "done" }
];

let tickets = loadTickets();

// draggedTicketId is set on dragstart and cleared on dragend/drop.
// Using a module-level variable avoids DataTransfer payloads and keeps the
// drop handler simple — only one card can be dragged at a time anyway.
let draggedTicketId = null;

// Restore saved state from localStorage; fall back to defaults if missing or corrupt
function loadTickets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...defaultTickets];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...defaultTickets];
  } catch (_err) {
    return [...defaultTickets];
  }
}

function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function render() {
  const todoCol = document.getElementById("col-todo");
  const inprogressCol = document.getElementById("col-inprogress");
  const doneCol = document.getElementById("col-done");

  todoCol.innerHTML = "";
  inprogressCol.innerHTML = "";
  doneCol.innerHTML = "";

  tickets.forEach((ticket) => {
    const el = document.createElement("article");
    el.className = "ticket";
    el.draggable = true;
    el.dataset.ticketId = ticket.id;
    el.innerHTML = `
      <strong>${ticket.id}</strong>
      <div>${ticket.title}</div>
      <small>Priority: ${ticket.priority}</small>
    `;

    // Record which ticket is being dragged and apply a visual "in-flight" style
    el.addEventListener("dragstart", () => {
      draggedTicketId = ticket.id;
      el.classList.add("dragging");
    });

    // Always clear drag state on dragend, even if the drop was cancelled (Escape key)
    el.addEventListener("dragend", () => {
      draggedTicketId = null;
      el.classList.remove("dragging");
    });

    if (ticket.status === "todo") todoCol.appendChild(el);
    else if (ticket.status === "inprogress") inprogressCol.appendChild(el);
    else doneCol.appendChild(el);
  });

  updateCounts();
}

// Derive counts from the source array each time to stay in sync with state
function updateCounts() {
  document.getElementById("count-todo").textContent = String(
    tickets.filter((t) => t.status === "todo").length
  );
  document.getElementById("count-inprogress").textContent = String(
    tickets.filter((t) => t.status === "inprogress").length
  );
  document.getElementById("count-done").textContent = String(
    tickets.filter((t) => t.status === "done").length
  );
}

function setupDropzones() {
  const zones = document.querySelectorAll(".dropzone");
  zones.forEach((zone) => {
    // Derive the target status from the element's id (e.g. "col-inprogress" → "inprogress")
    const status = zone.id.replace("col-", "");

    // Counter tracks nested dragenter/dragleave pairs.
    // Without this, dragleave fires every time the cursor moves from the dropzone
    // into a child ticket card, causing the highlight to flicker off even though
    // the drag is still within the same column.
    let enterCount = 0;

    // dragenter fires when entering the zone OR any of its children — increment counter
    zone.addEventListener("dragenter", (e) => {
      e.preventDefault();
      enterCount++;
      zone.classList.add("drag-over");
    });

    // dragleave fires when leaving the zone OR any child — only remove the highlight
    // when the counter reaches 0, meaning the cursor has truly left the zone
    zone.addEventListener("dragleave", () => {
      enterCount--;
      if (enterCount === 0) {
        zone.classList.remove("drag-over");
      }
    });

    // dragover must still call preventDefault to tell the browser this is a valid drop target
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // On drop: reset counter, remove highlight, update ticket status, persist, re-render
    zone.addEventListener("drop", () => {
      enterCount = 0;
      zone.classList.remove("drag-over");
      if (!draggedTicketId) return;
      const ticket = tickets.find((t) => t.id === draggedTicketId);
      if (ticket) {
        ticket.status = status;
        saveTickets();
        render();
      }
      draggedTicketId = null;
    });
  });
}

// Dropzones are set up once on load; event listeners survive re-renders
// because render() only rewrites the dropzone innerHTML, not the dropzone itself
setupDropzones();
render();
