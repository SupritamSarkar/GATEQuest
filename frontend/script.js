// ======================================================
// 🧠 GATE CS 2025 Syllabus Tracker - Connected to Node.js Backend
// ======================================================

// -----------------------------
// ⚙️ Configuration
// -----------------------------
const API_BASE = "http://localhost:5000"; // backend URL

// Temporary mock user (replace with actual login later)
const user = {
  id: "68efac2c5106ab83ab9d7021", // MongoDB user ID
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWZhYzJjNTEwNmFiODNhYjlkNzAyMSIsImlhdCI6MTc2MDUzNzcwNCwiZXhwIjoxNzYwNjQ1NzA0fQ.9SoU3ep0KtVTVp8v2KS5sB2o8FqLe_VFPYtDlsBRx2k",
};

// -----------------------------
// 📘 GATE CS 2025 Syllabus Data
// -----------------------------
const syllabusData = [
  {
    topic: "Engineering Mathematics",
    subtopics: [
      "Discrete Mathematics: Propositional and first order logic",
      "Sets, relations, functions, partial orders and lattices",
      "Monoids, Groups",
      "Graphs: connectivity, matching, coloring",
      "Combinatorics: counting, recurrence relations, generating functions",
      "Linear Algebra: matrices, determinants, system of equations, eigenvalues, LU decomposition",
      "Calculus: limits, continuity, differentiability, maxima/minima, mean value theorem, integration",
      "Probability and Statistics: random variables, distributions, mean, variance, Bayes theorem"
    ]
  },
  {
    topic: "Digital Logic",
    subtopics: [
      "Boolean algebra",
      "Combinational circuits",
      "Sequential circuits",
      "Minimization",
      "Number representations and computer arithmetic (fixed and floating point)"
    ]
  },
  {
    topic: "Computer Organization and Architecture",
    subtopics: [
      "Machine instructions and addressing modes",
      "ALU, datapath and control unit",
      "Instruction pipelining and hazards",
      "Memory hierarchy: cache, main, secondary",
      "I/O interface (interrupt and DMA)"
    ]
  },
  {
    topic: "Programming and Data Structures",
    subtopics: [
      "Programming in C, Recursion, Arrays, Stacks, Queues, Linked lists, Trees, BSTs, Heaps, Graphs"
    ]
  },
  {
    topic: "Algorithms",
    subtopics: [
      "Asymptotic time and space complexity",
      "Design techniques: greedy, dynamic programming, divide and conquer",
      "Graph traversals, MSTs, shortest paths"
    ]
  },
  {
    topic: "Theory of Computation",
    subtopics: [
      "Regular expressions, Finite automata, CFGs, Pushdown automata, Regular/Context-free languages, Pumping lemma, Turing machines, Undecidability"
    ]
  },
  {
    topic: "Compiler Design",
    subtopics: [
      "Lexical analysis, Syntax analysis, Syntax-directed translation, Runtime environments, Intermediate code generation, Local optimization, Data flow analysis"
    ]
  },
  {
    topic: "Operating System",
    subtopics: [
      "Processes, Threads, IPC, Concurrency, Deadlock, Scheduling, Memory management, Virtual memory, File systems"
    ]
  },
  {
    topic: "Databases",
    subtopics: [
      "ER model, Relational algebra, SQL, Integrity constraints, Normalization, File organization, Indexing (B/B+ trees), Transactions, Concurrency control"
    ]
  },
  {
    topic: "Computer Networks",
    subtopics: [
      "OSI & TCP/IP layers, switching, data link layer, routing protocols, IP addressing, TCP/UDP, DNS, SMTP, HTTP, FTP"
    ]
  }
];

// -----------------------------
// 📊 Application State
// -----------------------------
let appState = {
  syllabus: {},
  pyq: {},
  mockTests: [],
  stats: {
    completedTopics: 0,
    totalTopics: 0,
    progressPercent: 0,
    solvedPyqs: 0,
    totalPyqs: 0,
    pyqProgressPercent: 0,
  },
};

// -----------------------------
// 🌐 Database Functions
// -----------------------------
async function loadFromDatabase() {
  try {
    const res = await fetch(`${API_BASE}/api/syllabus/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    appState.syllabus = data?.syllabus || {};
    appState.pyq = data?.pyq || {};
    console.log("✅ Loaded syllabus from DB");
  } catch (err) {
    console.error("Error loading syllabus:", err);
  }
}

async function saveToDatabase() {
  try {
    await fetch(`${API_BASE}/api/syllabus/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        syllabus: appState.syllabus,
        pyq: appState.pyq,
      }),
    });
  } catch (err) {
    console.error("Error saving syllabus:", err);
  }
}

// -----------------------------
// 🧩 DOM Elements
// -----------------------------
const el = (id) => document.getElementById(id);
const elements = {
  syllabusContent: el("syllabus-content"),
  completedTopics: el("completed-topics"),
  totalTopics: el("total-topics"),
  progressPercent: el("progress-percent"),
  solvedPyqs: el("solved-pyqs"),
  totalPyqs: el("total-pyqs"),
  pyqProgressPercent: el("pyq-progress-percent"),
  addMockTestBtn: el("add-mock-test-btn"),
  mockTestForm: el("mock-test-form"),
  mockTestFormElement: el("mock-test-form-element"),
  cancelMockTest: el("cancel-mock-test"),
  testList: el("test-list"),
  totalTests: el("total-tests"),
  avgScore: el("avg-score"),
  bestScore: el("best-score"),
};

// -----------------------------
// 🚀 Initialize App
// -----------------------------
async function init() {
  await loadFromDatabase();
  await loadMockTests();
  renderSyllabus();
  renderMockTests();
  updateStats();
  updatePyqStats();
  bindEvents();
  console.log("✅ App initialized");
}

// -----------------------------
// 📋 Render Syllabus
// -----------------------------
function generateSubtopicId(ti, si) {
  return `topic-${ti}-subtopic-${si}`;
}

function renderSyllabus() {
  const container = elements.syllabusContent;
  if (!container) return;
  container.innerHTML = "";

  syllabusData.forEach((topic, ti) => {
    const topicDiv = document.createElement("div");
    topicDiv.className = "topic";
    topicDiv.innerHTML = `
      <div class="topic-header" onclick="toggleTopic(${ti})">
        <div class="topic-title"><span class="topic-toggle">▶</span>${topic.topic}</div>
      </div>
      <div class="topic-content">
        ${topic.subtopics
          .map((sub, si) => {
            const id = generateSubtopicId(ti, si);
            const sChecked = appState.syllabus[id] || false;
            const pChecked = appState.pyq[id] || false;
            return `
              <div class="subtopic">
                <div class="checkbox-group">
                  <label><input type="checkbox" class="syllabus-checkbox" data-subtopic-id="${id}" ${sChecked ? "checked" : ""}> Done</label>
                  <label><input type="checkbox" class="pyq-checkbox" data-subtopic-id="${id}" ${pChecked ? "checked" : ""}> PYQ</label>
                </div>
                <div class="subtopic-text">${sub}</div>
              </div>`;
          })
          .join("")}
      </div>`;
    container.appendChild(topicDiv);
  });
}

function toggleTopic(i) {
  const topics = document.querySelectorAll(".topic");
  const t = topics[i];
  if (t) t.classList.toggle("expanded");
}

// -----------------------------
// 🎯 Checkbox Handlers
// -----------------------------
function bindEvents() {
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("syllabus-checkbox")) {
      const id = e.target.dataset.subtopicId;
      appState.syllabus[id] = e.target.checked;
      saveToDatabase();
      updateStats();
    } else if (e.target.classList.contains("pyq-checkbox")) {
      const id = e.target.dataset.subtopicId;
      appState.pyq[id] = e.target.checked;
      saveToDatabase();
      updatePyqStats();
    }
  });

  if (elements.addMockTestBtn)
    elements.addMockTestBtn.addEventListener("click", showMockTestForm);
  if (elements.cancelMockTest)
    elements.cancelMockTest.addEventListener("click", hideMockTestForm);
  if (elements.mockTestFormElement)
    elements.mockTestFormElement.addEventListener("submit", handleMockTestSubmit);
}

// -----------------------------
// 🧾 Mock Test Form Controls
// -----------------------------
function showMockTestForm() {
  elements.mockTestForm.style.display = "block";
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("test-date");
  if (dateInput && !dateInput.value) dateInput.value = today;
}

function hideMockTestForm() {
  elements.mockTestForm.style.display = "none";
  elements.mockTestFormElement.reset();
}

// -----------------------------
// 📈 Update Stats
// -----------------------------
function updateStats() {
  let total = 0,
    done = 0;
  syllabusData.forEach((t, ti) =>
    t.subtopics.forEach((_, si) => {
      total++;
      if (appState.syllabus[generateSubtopicId(ti, si)]) done++;
    })
  );
  const percent = total ? Math.round((done / total) * 100) : 0;
  elements.completedTopics.textContent = done;
  elements.totalTopics.textContent = total;
  elements.progressPercent.textContent = `${percent}%`;
}

function updatePyqStats() {
  let total = 0,
    solved = 0;
  syllabusData.forEach((t, ti) =>
    t.subtopics.forEach((_, si) => {
      total++;
      if (appState.pyq[generateSubtopicId(ti, si)]) solved++;
    })
  );
  const percent = total ? Math.round((solved / total) * 100) : 0;
  elements.solvedPyqs.textContent = solved;
  elements.totalPyqs.textContent = total;
  elements.pyqProgressPercent.textContent = `${percent}%`;
}

// -----------------------------
// 🧪 Mock Tests
// -----------------------------
async function loadMockTests() {
  try {
    const res = await fetch(`${API_BASE}/api/mocktests/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    appState.mockTests = data || [];
  } catch (err) {
    console.error("Error loading mock tests:", err);
  }
}

async function handleMockTestSubmit(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const mockTest = {
    title: fd.get("title"),
    date: fd.get("date"),
    score: parseInt(fd.get("score")) || 0,
    remarks: fd.get("remarks"),
  };

  try {
    const res = await fetch(`${API_BASE}/api/mocktests/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(mockTest),
    });
    const saved = await res.json();
    appState.mockTests.unshift(saved);
    renderMockTests();
    hideMockTestForm();
    showNotification("Mock test added successfully!", "success");
  } catch (err) {
    console.error("Error adding mock test:", err);
  }
}

function renderMockTests() {
  const list = elements.testList;
  if (!list) return;
  if (appState.mockTests.length === 0) {
    list.innerHTML = `<div class="empty-state">No mock tests yet</div>`;
  } else {
    list.innerHTML = appState.mockTests.map(createTestElement).join("");
  }
  updateMockTestStats();
}

function createTestElement(test) {
  const scoreClass = getScoreClass(test.score);
  const date = new Date(test.date).toLocaleDateString();
   return `
    <div class="test-item">
      <div class="test-header">
        <div class="test-title">${test.title}</div>
        <div class="test-score ${scoreClass}">${test.score}%</div>
      </div>
      <div class="test-meta">
        <div class="test-date">${date}</div>
        <button class="delete-test btn btn-danger" onclick="deleteMockTest('${test._id}')">🗑️ Delete</button>
      </div>
      ${test.remarks ? `<div class="test-remarks">${test.remarks}</div>` : ""}
    </div>`;
}

function getScoreClass(score) {
  if (score >= 80) return "excellent";  // green
  if (score >= 60) return "good";       // yellow
  if (score >= 40) return "average";    // orange
  return "poor";                        // red
}


function updateMockTestStats() {
  const total = appState.mockTests.length;
  let totalScore = 0,
    best = 0;
  appState.mockTests.forEach((t) => {
    totalScore += t.score;
    best = Math.max(best, t.score);
  });
  const avg = total ? Math.round(totalScore / total) : 0;
  elements.totalTests.textContent = total;
  elements.avgScore.textContent = avg;
  elements.bestScore.textContent = best;
}

async function deleteMockTest(testId) {
  if (!confirm("Delete this test?")) return;
  try {
    await fetch(`${API_BASE}/api/mocktests/${user.id}/${testId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    appState.mockTests = appState.mockTests.filter((t) => t._id !== testId);
    renderMockTests();
    showNotification("Mock test deleted", "success");
  } catch (err) {
    console.error("Error deleting mock test:", err);
  }
}

// -----------------------------
// 💬 Notifications
// -----------------------------
function showNotification(msg, type = "info") {
  const n = document.createElement("div");
  n.className = `notification-${type}`;
  n.textContent = msg;
  Object.assign(n.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 14px",
    background: type === "success" ? "green" : "blue",
    color: "white",
    borderRadius: "8px",
    opacity: 0,
    transition: "0.3s",
  });
  document.body.appendChild(n);
  setTimeout(() => (n.style.opacity = 1), 50);
  setTimeout(() => {
    n.style.opacity = 0;
    setTimeout(() => n.remove(), 300);
  }, 3000);
}

// -----------------------------
// 🏁 Run App
// -----------------------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Expose for inline handlers
window.toggleTopic = toggleTopic;
window.deleteMockTest = deleteMockTest;
