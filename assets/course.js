(function () {
  const { courses, deptName, deptHue, semesterKey, slug, escapeHtml,
          statusOf, STATUS_LABEL, stars, initTheme } = window.CM;
  initTheme();

  const root = document.getElementById("course");
  const id = new URLSearchParams(location.search).get("id");
  const c = courses.find((x) => String(x.number).trim() === id);

  if (!c) {
    root.innerHTML = `<h1>Class not found</h1>
      <p>There's no class with the number <code>${escapeHtml(id || "")}</code> in <code>data/courses.js</code>.</p>
      <p><a href="./">← Back to all classes</a></p>`;
    return;
  }

  document.title = `${c.number} ${c.title} · Course Map`;
  root.style.setProperty("--hue", deptHue(c.number));
  const st = statusOf(c);

  const facts = [
    ["Semester", c.semester],
    ["Department", deptName(c.number)],
    ["Units", c.units],
    ["Instructors", (c.instructors || []).join(", ")],
    ["Status", STATUS_LABEL[st]],
    ["Grade", c.grade],
    ["Time per week", c.hours ? `~${c.hours} hours` : ""],
    ["My rating", c.rating ? stars(c.rating) : ""],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");

  // Prev / next in chronological order.
  const ordered = [...courses].sort((a, b) =>
    semesterKey(a.semester) - semesterKey(b.semester) || a.number.localeCompare(b.number));
  const i = ordered.indexOf(c);
  const prev = ordered[i - 1], next = ordered[i + 1];
  const navLink = (x, dir) => x
    ? `<a class="pager-${dir}" href="course.html?id=${slug(x.number)}"><small>${dir === "prev" ? "← Previous" : "Next →"}</small><span>${escapeHtml(x.number)} ${escapeHtml(x.title)}</span></a>`
    : "<span></span>";

  root.innerHTML = `
    <article class="course">
      <p class="eyebrow"><a href="./">All classes</a> / ${escapeHtml(c.semester)}</p>
      <h1><span class="num">${escapeHtml(c.number)}</span> ${escapeHtml(c.title)}</h1>
      ${c.summary ? `<p class="lede">${escapeHtml(c.summary)}</p>` : ""}
      ${(c.tags || []).length ? `<ul class="tags">${c.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>` : ""}

      <dl class="facts">
        ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === "My rating" ? v : escapeHtml(v)}</dd></div>`).join("")}
      </dl>

      ${(c.takeaways || []).length ? `
        <section>
          <h2>Key takeaways</h2>
          <ul class="takeaways">${c.takeaways.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
        </section>` : ""}

      ${c.notes ? `<section><h2>Notes</h2><div class="prose" id="notes"><p class="muted">Loading notes…</p></div></section>` : ""}

      ${(c.links || []).length ? `
        <section>
          <h2>Links</h2>
          <ul class="links">${c.links.map((l) =>
            `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label || l.url)} ↗</a></li>`).join("")}</ul>
        </section>` : ""}
    </article>

    <nav class="pager" aria-label="Other classes">${navLink(prev, "prev")}${navLink(next, "next")}</nav>`;

  if (c.notes) loadNotes(c);

  async function loadNotes(course) {
    const el = document.getElementById("notes");
    const file = typeof course.notes === "string" ? course.notes : `notes/${course.number}.md`;
    try {
      const res = await fetch(file, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const md = await res.text();
      el.innerHTML = window.marked
        ? window.marked.parse(md)
        : miniMarkdown(md);
    } catch (err) {
      const local = location.protocol === "file:";
      el.innerHTML = `<p class="muted">${local
        ? "Notes can't load from a file opened directly. Run <code>python3 -m http.server</code> in the project folder and open <code>http://localhost:8000</code>."
        : `Couldn't find <code>${escapeHtml(file)}</code>.`}</p>`;
    }
  }

  // Small fallback renderer, used only if the Markdown library can't load.
  function miniMarkdown(md) {
    const inline = (s) => escapeHtml(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    const out = [];
    const lines = md.replace(/\r/g, "").split("\n");
    let list = null, para = [];
    const flush = () => {
      if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; }
      if (list) { out.push(`</${list}>`); list = null; }
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let m;
      if (line.startsWith("```")) {
        flush();
        const code = [];
        while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
        out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      } else if ((m = /^(#{1,6})\s+(.*)/.exec(line))) {
        flush(); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
      } else if ((m = /^>\s?(.*)/.exec(line))) {
        flush(); out.push(`<blockquote><p>${inline(m[1])}</p></blockquote>`);
      } else if ((m = /^\s*([-*]|\d+\.)\s+(.*)/.exec(line))) {
        const tag = /\d/.test(m[1]) ? "ol" : "ul";
        if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; }
        if (list !== tag) { if (list) out.push(`</${list}>`); out.push(`<${tag}>`); list = tag; }
        out.push(`<li>${inline(m[2])}</li>`);
      } else if (!line.trim()) {
        flush();
      } else {
        if (list) { out.push(`</${list}>`); list = null; }
        para.push(line.trim());
      }
    }
    flush();
    return out.join("\n");
  }
})();
