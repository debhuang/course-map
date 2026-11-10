(function () {
  const { courses, deptCode, deptName, deptHue, semesterKey, slug,
          escapeHtml, statusOf, STATUS_LABEL, stars, initTheme } = window.CM;
  initTheme();

  const $ = (s) => document.querySelector(s);
  const state = { q: "", dept: "", status: "", view: "timeline" };

  try {
    const v = localStorage.getItem("view");
    if (v === "timeline" || v === "dept") state.view = v;
  } catch (_) {}

  // ── Stats ────────────────────────────────────────────────
  function renderStats() {
    const done = courses.filter((c) => statusOf(c) === "completed");
    const units = done.reduce((s, c) => s + (Number(c.units) || 0), 0);
    const sems = new Set(courses.map((c) => c.semester)).size;
    const depts = new Set(courses.map((c) => deptCode(c.number))).size;
    const items = [
      ["Classes", courses.length],
      ["Units completed", units],
      ["Semesters", sems],
      ["Departments", depts],
    ];
    $("#stats").innerHTML = items
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  }

  // ── Filters ──────────────────────────────────────────────
  function populateDepts() {
    const codes = [...new Set(courses.map((c) => deptCode(c.number)))].sort();
    $("#dept").insertAdjacentHTML("beforeend", codes.map((code) =>
      `<option value="${code}">${code} · ${escapeHtml(deptName(code))}</option>`).join(""));
  }

  function matches(c) {
    if (state.dept && deptCode(c.number) !== state.dept) return false;
    if (state.status && statusOf(c) !== state.status) return false;
    if (!state.q) return true;
    const hay = [c.number, c.number.replace("-", ""), c.title, c.summary,
      ...(c.tags || []), ...(c.instructors || []), deptName(c.number)]
      .join(" ").toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }

  // ── Cards ────────────────────────────────────────────────
  function card(c) {
    const st = statusOf(c);
    const meta = [
      c.units ? `${c.units} units` : "",
      c.hours ? `~${c.hours} hrs/wk` : "",
    ].filter(Boolean).join(" · ");
    return `
      <a class="card" href="course.html?id=${slug(c.number)}" style="--hue:${deptHue(c.number)}">
        <div class="card-top">
          <span class="num">${escapeHtml(c.number)}</span>
          ${st !== "completed" ? `<span class="pill pill-${st}">${STATUS_LABEL[st]}</span>` : ""}
        </div>
        <h3>${escapeHtml(c.title)}</h3>
        ${c.summary ? `<p class="summary">${escapeHtml(c.summary)}</p>` : ""}
        <div class="card-foot">
          <span class="meta">${meta}</span>
          ${stars(c.rating)}
        </div>
      </a>`;
  }

  function group(list, keyFn, labelFn, sortFn, subFn) {
    const map = new Map();
    for (const c of list) {
      const k = keyFn(c);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(c);
    }
    return [...map.entries()].sort(sortFn).map(([k, items]) => {
      items.sort((a, b) => a.number.localeCompare(b.number));
      const units = items.reduce((s, c) => s + (Number(c.units) || 0), 0);
      return `
        <section class="group">
          <header class="group-head">
            <h2>${escapeHtml(labelFn(k))}</h2>
            <span class="group-meta">${items.length} ${items.length === 1 ? "class" : "classes"}${units ? ` · ${units} units` : ""}${subFn ? subFn(k) : ""}</span>
          </header>
          <div class="grid">${items.map(card).join("")}</div>
        </section>`;
    }).join("");
  }

  function render() {
    const list = courses.filter(matches);
    const out = $("#results");
    if (!courses.length) {
      out.innerHTML = `<p class="empty">No classes yet — add some to <code>data/courses.js</code>.</p>`;
      return;
    }
    if (!list.length) {
      out.innerHTML = `<p class="empty">No classes match those filters.</p>`;
      return;
    }
    out.innerHTML = state.view === "dept"
      ? group(list, (c) => deptCode(c.number), (k) => `${k} · ${deptName(k)}`,
              (a, b) => a[0].localeCompare(b[0]))
      : group(list, (c) => c.semester, (k) => k,
              (a, b) => semesterKey(a[0]) - semesterKey(b[0]));
  }

  // ── Wire up ──────────────────────────────────────────────
  $("#search").addEventListener("input", (e) => { state.q = e.target.value.trim(); render(); });
  $("#dept").addEventListener("change", (e) => { state.dept = e.target.value; render(); });
  $("#status").addEventListener("change", (e) => { state.status = e.target.value; render(); });
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.view === state.view));
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      try { localStorage.setItem("view", state.view); } catch (_) {}
      document.querySelectorAll("[data-view]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn)));
      render();
    });
  });

  renderStats();
  populateDepts();
  render();
})();
