# Course Map

A personal website that documents every class I take at Carnegie Mellon:
when I took it, how many units it was, how much work it was, what I learned,
and longer notes for each one.

It's a plain static site, so there's no build step and nothing to install.

## Adding a class

1. Open `data/courses.js` and add an entry:

   ```js
   {
     number: "15-150",
     title: "Principles of Functional Programming",
     semester: "Fall 2025",          // "Fall|Spring|Summer YYYY"
     units: 12,
     instructors: ["…"],
     status: "completed",            // completed | in-progress | planned
     rating: 5,                      // 1–5
     hours: 10,                      // hours per week
     tags: ["core", "sml"],
     summary: "Shown on the card.",
     takeaways: ["…"],
     links: [{ label: "Course site", url: "https://…" }],
     notes: true,                    // loads notes/15-150.md
   },
   ```

   Only `number`, `title` and `semester` are required. Add `grade` only if
   you want it shown publicly.

2. (Optional) For longer write-ups, create `notes/<number>.md`, for example
   `notes/15-150.md`, and set `notes: true`.

The example entries in `data/courses.js` are placeholders. Replace them with
your own classes.

## Viewing locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly works too,
but the Markdown notes only load when the site is served over HTTP.

## Publishing on GitHub Pages

In the repository on GitHub, go to **Settings → Pages**, set **Source** to
"Deploy from a branch", pick your branch and the `/ (root)` folder, and save.
The site will be at `https://<your-username>.github.io/course-map/`.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home page: stats, search, filters, classes by semester or department |
| `course.html` | One page per class (`course.html?id=15-122`) |
| `data/courses.js` | **Your class data — the file you edit** |
| `notes/*.md` | Optional Markdown notes per class |
| `assets/` | Styles and scripts |
