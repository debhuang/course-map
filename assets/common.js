/* Shared helpers for every page. */
(function () {
  // CMU department codes → names (first two digits of the course number).
  const DEPARTMENTS = {
    "02": "Computational Biology",
    "03": "Biological Sciences",
    "05": "Human-Computer Interaction",
    "06": "Chemical Engineering",
    "07": "SCS Interdisciplinary",
    "09": "Chemistry",
    "10": "Machine Learning",
    "11": "Language Technologies",
    "12": "Civil & Environmental Eng.",
    "14": "Information Networking",
    "15": "Computer Science",
    "16": "Robotics",
    "17": "Software & Societal Systems",
    "18": "Electrical & Computer Eng.",
    "19": "Engineering & Public Policy",
    "21": "Mathematical Sciences",
    "24": "Mechanical Engineering",
    "27": "Materials Science & Eng.",
    "33": "Physics",
    "36": "Statistics & Data Science",
    "38": "MCS Interdisciplinary",
    "39": "CIT Interdisciplinary",
    "42": "Biomedical Engineering",
    "45": "Tepper (Graduate)",
    "46": "Tepper (Graduate)",
    "48": "Architecture",
    "51": "Design",
    "53": "Entertainment Technology",
    "54": "Drama",
    "57": "Music",
    "60": "Art",
    "62": "CFA Interdisciplinary",
    "66": "Dietrich Interdisciplinary",
    "67": "Information Systems",
    "69": "Physical Education",
    "70": "Business Administration",
    "73": "Economics",
    "76": "English",
    "79": "History",
    "80": "Philosophy",
    "82": "Modern Languages",
    "84": "Institute for Politics & Strategy",
    "85": "Psychology",
    "86": "Neuroscience",
    "88": "Social & Decision Sciences",
    "90": "Heinz College",
    "94": "Heinz College",
    "95": "Heinz College",
    "98": "StuCo",
    "99": "University-wide",
  };

  const SEASON_ORDER = { spring: 1, summer: 2, fall: 3 };

  function deptCode(number) {
    return String(number).split("-")[0].padStart(2, "0");
  }

  function deptName(number) {
    const code = deptCode(number);
    return DEPARTMENTS[code] || `Department ${code}`;
  }

  // "Fall 2024" → 20243 so semesters sort chronologically.
  function semesterKey(sem) {
    const m = /^(spring|summer|fall)\s+(\d{4})$/i.exec(String(sem).trim());
    if (!m) return Number.MAX_SAFE_INTEGER;
    return Number(m[2]) * 10 + SEASON_ORDER[m[1].toLowerCase()];
  }

  // Stable hue per department so each one gets its own accent colour.
  function deptHue(number) {
    const code = Number(deptCode(number)) || 0;
    return (code * 47) % 360;
  }

  function slug(number) {
    return encodeURIComponent(String(number).trim());
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  const STATUS_LABEL = {
    completed: "Completed",
    "in-progress": "In progress",
    planned: "Planned",
  };

  function statusOf(c) {
    return STATUS_LABEL[c.status] ? c.status : "completed";
  }

  function stars(n) {
    if (!n) return "";
    const r = Math.max(0, Math.min(5, Math.round(n)));
    return `<span class="stars" aria-label="${r} out of 5">${"★".repeat(r)}<span class="dim">${"★".repeat(5 - r)}</span></span>`;
  }

  // Theme toggle (remembered per browser; falls back to system setting).
  function initTheme() {
    const btn = document.querySelector("[data-theme-toggle]");
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (_) {}
    if (saved) document.documentElement.dataset.theme = saved;
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  }

  const courses = (window.COURSES || []).filter((c) => c && c.number && c.title);

  window.CM = {
    courses, deptCode, deptName, deptHue, semesterKey, slug,
    escapeHtml, statusOf, STATUS_LABEL, stars, initTheme,
  };
})();
