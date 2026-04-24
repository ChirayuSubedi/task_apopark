const STORAGE_KEY = "task6-ticket-board-v1";

const defaultTickets = [
  { id: "T-100", title: "Broken barrier in Zone B", priority: "high", status: "todo" },
  { id: "T-101", title: "Refund request for duplicate charge", priority: "medium", status: "todo" },
  { id: "T-102", title: "Camera stream lagging", priority: "high", status: "inprogress" },
  { id: "T-103", title: "Update signage in entrance", priority: "low", status: "done" }
];

let tickets = loadTickets();
let draggedTicketId = null;

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

    // TODO: implement dragstart/dragend handlers and set draggedTicketId

    if (ticket.status === "todo") todoCol.appendChild(el);
    else if (ticket.status === "inprogress") inprogressCol.appendChild(el);
    else doneCol.appendChild(el);
  });

  updateCounts();
}

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
    const status = zone.id.replace("col-", "");

    // TODO:
    // - prevent default on dragover
    // - add/remove "drag-over" class for visual feedback
    // - on drop: move dragged ticket to this status
    // - persist to localStorage and re-render
    void status;
  });
}

setupDropzones();
render();
