/*
 * ─────────────────────────────────────────────────────────────
 *  YOUR COURSES
 * ─────────────────────────────────────────────────────────────
 *  Add one object per class. Only `number`, `title` and
 *  `semester` are required; everything else is optional.
 *
 *  number      "15-122"            CMU course number (dept-num)
 *  title       "Principles of …"   Course name
 *  semester    "Fall 2024"         "Fall|Spring|Summer YYYY"
 *  units       12                  CMU units
 *  instructors ["Name", …]
 *  grade       "A"                 Leave out to keep it private
 *  status      "completed"         "completed" | "in-progress" | "planned"
 *  rating      4                   Your rating, 1–5
 *  hours       12                  Avg. hours per week you spent
 *  tags        ["core", "systems"]
 *  summary     "One or two lines shown on the card"
 *  takeaways   ["Things you learned", …]
 *  links       [{ label: "Course site", url: "https://…" }]
 *  notes       true                Loads notes/<number>.md on the course page
 *
 *  The entries below are examples — replace them with your own.
 */
window.COURSES = [
  {
    number: "15-112",
    title: "Fundamentals of Programming and Computer Science",
    semester: "Fall 2024",
    units: 12,
    instructors: ["Example Instructor"],
    status: "completed",
    rating: 5,
    hours: 14,
    tags: ["core", "python"],
    summary: "Intro programming in Python, ending with a term project.",
    takeaways: [
      "Problem decomposition and writing clean, testable functions",
      "Recursion, and when to reach for it",
      "Scoping and building a term project from scratch",
    ],
    links: [{ label: "Course site", url: "https://www.cs.cmu.edu/~112/" }],
    notes: true,
  },
  {
    number: "21-127",
    title: "Concepts of Mathematics",
    semester: "Fall 2024",
    units: 12,
    status: "completed",
    rating: 4,
    hours: 10,
    tags: ["core", "proofs"],
    summary: "Proof techniques, sets, functions, induction and number theory.",
    takeaways: ["Writing rigorous proofs", "Induction in all its forms"],
  },
  {
    number: "76-101",
    title: "Interpretation and Argument",
    semester: "Fall 2024",
    units: 9,
    status: "completed",
    rating: 3,
    hours: 6,
    tags: ["gen-ed", "writing"],
    summary: "Academic writing built around research-based argument.",
  },
  {
    number: "15-122",
    title: "Principles of Imperative Computation",
    semester: "Spring 2025",
    units: 12,
    status: "completed",
    rating: 4,
    hours: 13,
    tags: ["core", "c", "data structures"],
    summary: "Contracts, data structures and memory in C0 and C.",
    notes: true,
  },
  {
    number: "21-241",
    title: "Matrices and Linear Transformations",
    semester: "Spring 2025",
    units: 11,
    status: "completed",
    rating: 4,
    hours: 8,
    tags: ["math"],
  },
  {
    number: "15-213",
    title: "Introduction to Computer Systems",
    semester: "Fall 2025",
    units: 12,
    status: "in-progress",
    tags: ["core", "systems"],
    summary: "How programs actually run: memory, caches, processes, networking.",
  },
  {
    number: "36-218",
    title: "Probability Theory for Computer Scientists",
    semester: "Spring 2026",
    units: 9,
    status: "planned",
    tags: ["math", "probability"],
  },
];
