/* ============================================================
   BERA RAHUL TEJA — Portfolio
   script.js
   ============================================================ */

// ----------------------------------------------------------------
// 1) PROJECT DATA
//    Edit this array to add/update projects. `repo` should point
//    at the exact GitHub repository for that project — right now
//    both fall back to the profile URL since the exact repo slugs
//    weren't confirmed; swap in the real repo links, e.g.
//    "https://github.com/Rahulteja12/blockchain-banking-security"
// ----------------------------------------------------------------
const PROJECTS = [
  {
    id: "0x7f3a",
    kind: "Major Project",
    title: "Blockchain-Based Banking Transaction Security System",
    desc: "A full-stack application that secures banking transactions by generating and validating a blockchain block for every transaction, replacing traditional verification methods. Backend built in Java with JDBC for data persistence; front end in HTML, CSS, and JavaScript — owned end to end from architecture to working demo.",
    stack: ["Java", "JDBC", "MySQL", "HTML", "CSS", "JavaScript", "Apache Tomcat"],
    repo: "https://github.com/Rahulteja12", // TODO: replace with exact repo URL
    demo: null,
    // Detailed case-study breakdown, rendered inside an expandable panel.
    details: [
      {
        heading: "The problem",
        body: "Most banking systems still lean on a centralized database to hold account and transaction history. That's a single point of failure: one breach exposes the whole store, and a lot of existing blockchain-style proposals for banking still skip proper secure hashing of each transaction, leaving records open to tampering after the fact."
      },
      {
        heading: "The approach",
        body: "This system swaps the centralized store for a decentralized, chained ledger, but keeps the bank as the sole authority that can write a new block — no miners, no tokens, no cryptocurrency layer. When one party sends money to another, the bank first verifies and validates the transfer, then commits it as a new block rather than just updating a row in a table."
      },
      {
        heading: "Keeping every block honest",
        body: "Each block is fingerprinted with the SHA-256 hashing algorithm, which reduces the transaction data to a fixed-length hash. Before a new block is accepted, its hash is checked against the previous block's hash — so altering any past record breaks that chain and is immediately detectable, instead of silently succeeding the way it would in a plain database update."
      },
      {
        heading: "Verifying without exposing identities",
        body: "Transfers use public/private key pairs: the sender signs the transaction data with their private key against the recipient's public key, producing a digitally signed, timestamped block that proves the transaction happened without revealing who the parties are. That block is then broadcast to the connected nodes, which act as validators before it's permanently added to the chain."
      },
      {
        heading: "Roles in the system",
        body: "Access is split across four roles — User, Agent, Auditor, and Bank Admin — so day-to-day transactions, oversight, and administration each operate through their own permissions instead of one shared login."
      },
      {
        heading: "Why it matters",
        body: "The net effect is a ledger where tampering with history is self-evident rather than something a DBA has to notice manually, and where security doesn't depend on trusting one centralized store — while still avoiding the overhead of a full public blockchain's mining/token economy, since the bank itself plays that trusted-validator role."
      }
    ]
  },
  {
    id: "0x2c91",
    kind: "Mini Project",
    title: "Online Gift Store",
    desc: "A full-stack e-commerce style application to manage customers, orders, and order placement with a relational MySQL backend. Codebase structured for readability and easy extension, prioritizing clean, maintainable logic for future feature changes.",
    stack: ["Java", "MySQL", "JDBC"],
    repo: "https://github.com/Rahulteja12", // TODO: replace with exact repo URL
    demo: null,
    details: null
  }
];

// ----------------------------------------------------------------
// 2) RENDER PROJECT CARDS
// ----------------------------------------------------------------
function renderProjects() {
  const list = document.getElementById("projectsList");
  if (!list) return;

  list.innerHTML = PROJECTS.map(p => `
    <article class="project-card reveal">
      <div class="project-top">
        <h3>${p.title}</h3>
        <span class="project-kind">${p.kind}</span>
      </div>
      <p class="desc">${p.desc}</p>
      <div class="project-stack">
        ${p.stack.map(s => `<span>${s}</span>`).join("")}
      </div>
      <div class="project-links">
        <a href="${p.repo}" target="_blank" rel="noopener">↳ ${p.id} · view repo ↗</a>
        ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">↳ live demo ↗</a>` : ""}
      </div>
      ${p.details ? renderCaseStudy(p) : ""}
    </article>
  `).join("");
}

// Expandable "case study" panel — a <details> element so it's keyboard-
// and screen-reader accessible with zero extra JS for the open/close state.
function renderCaseStudy(p) {
  return `
    <details class="case-study">
      <summary>
        <span class="case-study-toggle-label">Read the full breakdown</span>
        <span class="case-study-chevron" aria-hidden="true">↓</span>
      </summary>
      <div class="case-study-body">
        ${p.details.map(section => `
          <div class="case-study-section">
            <h4><span class="hexid">↳</span> ${section.heading}</h4>
            <p>${section.body}</p>
          </div>
        `).join("")}
      </div>
    </details>
  `;
}

// ----------------------------------------------------------------
// 3) MOBILE NAV TOGGLE
// ----------------------------------------------------------------
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ----------------------------------------------------------------
// 4) ACTIVE NAV LINK ON SCROLL
// ----------------------------------------------------------------
function initActiveLinkTracking() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const map = new Map();
  navLinks.forEach(a => map.set(a.getAttribute("href").slice(1), a));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = map.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// ----------------------------------------------------------------
// 5) SCROLL REVEAL (chain "confirms" as blocks enter view)
// ----------------------------------------------------------------
function initRevealOnScroll() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  targets.forEach(t => observer.observe(t));
}

// ----------------------------------------------------------------
// 6) HERO CLOCK — small ambient "live" detail (IST)
// ----------------------------------------------------------------
function initHeroClock() {
  const el = document.getElementById("heroClock");
  if (!el) return;

  function tick() {
    const now = new Date();
    const opts = { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" };
    el.textContent = now.toLocaleTimeString("en-GB", opts);
  }
  tick();
  setInterval(tick, 1000);
}

// ----------------------------------------------------------------
// 7) FOOTER YEAR
// ----------------------------------------------------------------
function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ----------------------------------------------------------------
// INIT
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initNavToggle();
  initActiveLinkTracking();
  initRevealOnScroll();   // must run after renderProjects() so cards are in the DOM
  initHeroClock();
  initFooterYear();
});