/* ====== EDIT THESE ====== */
const CONFIG = {
  email: "agnanu2006@gmail.com",
  phone: "918273194585", // country code + number, no + or spaces
  phoneDisplay: "+91 8273194585",
  github: "https://github.com/Nancy-Agarwal03",
  linkedin: "#", // paste your LinkedIn URL
  projectLinks: { sales: "#", studentdb: "#", eda: "#", learning: "https://github.com/Nancy-Agarwal03/AI-Learning-Assistant-project", learnloopvideo: "https://lnkd.in/p/gjm7th8z", secondlife: "#", route: "#", smartweave: "#" },
  // Certificates: files live in assets/certificates/
  certificates: [
    { title: "Introduction to IoT and Digital Transformation", issuer: "Cisco Networking Academy · EdCreate Foundation", date: "26 Feb 2026", image: "cisco-iot.jpg" },
    { title: "Generative AI Fluency", issuer: "FutureSkills Prime · MeitY & Nasscom", date: "6 Mar 2026", image: "genai-fluency.jpg" },
    { title: "Power BI Crash Course", issuer: "Skill Course E-Learning", date: "8 Oct 2026", image: "powerbi-crash-course.jpg" },
    { title: "Bharatiya Antariksh Hackathon 2026", issuer: "ISRO · Hack2skill (Participation)", date: "2026", image: "isro-antariksh.jpg" },
    { title: "Build X Hackathon", issuer: "Trae (Participation)", date: "26 Feb 2026", image: "trae-buildx.jpg" },
    { title: "Online AI Product Pitch Night 2026", issuer: "Google Student Ambassador Program", date: "30 May 2026", image: "google-pitch-night.jpg" },
    { title: "Build Your Fest Stall: Brand It, Pitch It, Launch It", issuer: "SkyThink Tech · Unstop (Participation)", date: "2026", image: "unstop-fest-stall.jpg" },
    { title: "AI Community Day · Volunteering", issuer: "Spark Tech AI Hub", date: "22 Aug 2026", image: "spark-tech-volunteer.jpg" }
  ],
  roles: ["clear insights.", "clean SQL tables.", "Power BI dashboards.", "stories people understand."]
};
/* ======================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

// Links and contact details
$("#wa").href = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent("Hi Nancy, I saw your portfolio!")}`;
$("#gh").href = CONFIG.github;
if (CONFIG.linkedin && CONFIG.linkedin !== "#") $("#li").href = CONFIG.linkedin; else $("#li").hidden = true;
$("#phone-text").textContent = CONFIG.phoneDisplay;
$("#email-text").textContent = CONFIG.email;
$("#draft-to").textContent = CONFIG.email;
$$("[data-link]").forEach(a => {
  const u = CONFIG.projectLinks[a.dataset.link];
  if (u && u !== "#") { a.href = u; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true;
});
$("#yr").textContent = new Date().getFullYear();

// Copy helper (clipboard may be refused, so fall back to selecting the text)
async function copyText(text, statusEl, source) {
  try {
    await navigator.clipboard.writeText(text);
    if (statusEl) statusEl.textContent = "Copied.";
    return true;
  } catch (e) {
    if (source) {
      try {
        const r = document.createRange(); r.selectNodeContents(source);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        if (source.select) source.select();
      } catch (e2) {}
    }
    if (statusEl) statusEl.textContent = "Select the text and copy it with your keyboard.";
    return false;
  }
}
$$(".copy").forEach(btn => btn.addEventListener("click", async () => {
  const src = document.getElementById(btn.dataset.copyFrom);
  const ok = await copyText(src.textContent, null, src);
  const old = btn.textContent; btn.textContent = ok ? "Copied" : "Select & copy";
  setTimeout(() => btn.textContent = old, 1600);
}));

// Message form: builds a draft to copy, with an email-app link that may not work everywhere
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#f-name").value.trim(), email = $("#f-email").value.trim(), msg = $("#f-msg").value.trim();
  const text = `${msg}\n\n${name}\n${email}`;
  $("#draft-text").value = text;
  $("#open-mail").href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Portfolio message from " + name)}&body=${encodeURIComponent(text)}`;
  $("#draft-status").textContent = "";
  $("#draft").hidden = false;
});
$("#copy-draft").addEventListener("click", () => copyText($("#draft-text").value, $("#draft-status"), $("#draft-text")));

// Certificates
const certBox = $("#certs");
CONFIG.certificates.forEach(c => {
  const d = document.createElement("div");
  d.className = "cert reveal";
  d.innerHTML = `<div class="thumb">${c.image ? `<img src="assets/certificates/${c.image}" alt="${c.title}" loading="lazy">` : "🏅"}</div><h4>${c.title}</h4><p>${[c.issuer, c.date].filter(Boolean).join(" · ")}</p>`;
  certBox.appendChild(d);
});

// Theme: follows the system until the toggle is used
try { const t = localStorage.getItem("theme"); if (t === "dark" || t === "light") root.dataset.theme = t; } catch (e) {}
$("#theme").onclick = () => {
  const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
};

// Mobile menu
const menu = $("#menu");
$("#burger").onclick = () => menu.classList.toggle("open");
$$("#menu a").forEach(a => a.onclick = () => menu.classList.remove("open"));

// Scroll progress
addEventListener("scroll", () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  $("#progress").style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
}, { passive: true });

// Reveal on scroll, skill bars, counters. Hidden states only apply once the observer exists.
const countUp = el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || "";
  let n = 0; const step = Math.max(1, Math.ceil(end / 60));
  const t = setInterval(() => { n = Math.min(end, n + step); el.textContent = n.toLocaleString() + suf; if (n >= end) clearInterval(t); }, 25);
};
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .12 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) { el.classList.add("in"); $$("[data-count]", el).forEach(countUp); }
    else io.observe(el);
  });
  root.classList.add("js-reveal");
}

// Typewriter (starts after the first phrase has been shown)
(function () {
  const el = $("#typed"); let r = 0, c = CONFIG.roles[0].length, del = false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  (function tick() {
    const w = CONFIG.roles[r];
    el.textContent = w.slice(0, c);
    if (!del && c === w.length) { del = true; return setTimeout(tick, 1800); }
    if (del && c === 0) { del = false; r = (r + 1) % CONFIG.roles.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
})();

// Photo tilt (desktop pointer only)
const tilt = $("#tilt");
if (matchMedia("(hover:hover)").matches) {
  tilt.parentElement.addEventListener("mousemove", e => {
    const b = tilt.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    tilt.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  tilt.parentElement.addEventListener("mouseleave", () => tilt.style.transform = "");
}

// Lightbox
const lb = $("#lb"), lbImg = $("img", lb);
document.addEventListener("click", e => {
  const img = e.target.closest(".g img, .cert .thumb img");
  if (img) { lbImg.src = img.src; lb.classList.add("open"); }
  else if (e.target.closest("#lb")) lb.classList.remove("open");
});
addEventListener("keydown", e => e.key === "Escape" && lb.classList.remove("open"));
