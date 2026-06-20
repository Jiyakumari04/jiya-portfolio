/* ── PARTICLE NETWORK ── */
(function () {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    dots = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initDots() {
    dots = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.4,
        hue: Math.random() > 0.5 ? 260 : 320,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${d.hue},80%,70%,0.3)`;
      ctx.fill();
    });
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x,
          dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(124,92,252,${0.07 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  initDots();
  draw();
  window.addEventListener("resize", () => {
    resize();
    initDots();
  });
})();

/* ── NAV SCROLL ── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

/* ── HAMBURGER ── */
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});
document.querySelectorAll("#mobileMenu a").forEach((a) => {
  a.addEventListener("click", () =>
    document.getElementById("mobileMenu").classList.remove("open"),
  );
});

/* ── TYPING ROLE ── */
const roles = [
  "Full-Stack Developer · Cybersecurity Enthusiast",
  "Java & Spring Backend Developer",
  "React.js Frontend Builder",
  "Ethical Hacking Learner",
];
let ri = 0,
  ci = 0,
  deleting = false;
const roleEl = document.getElementById("heroRole");

function type() {
  const cur = roles[ri];
  const cursor = '<span class="cursor"></span>';
  if (!deleting) {
    roleEl.innerHTML =
      cur.slice(0, ci + 1).replace(" · ", ' <span class="divider">·</span> ') +
      cursor;
    ci++;
    if (ci === cur.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    roleEl.innerHTML =
      cur.slice(0, ci - 1).replace(" · ", ' <span class="divider">·</span> ') +
      cursor;
    ci--;
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      setTimeout(type, 350);
      return;
    }
  }
  setTimeout(type, deleting ? 26 : 52);
}
setTimeout(type, 1000);

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), 60);
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -36px 0px" },
);
revealEls.forEach((el) => revealObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounters() {
  document.querySelectorAll(".stat-num[data-target]").forEach((el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = "1";
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || "";
    const start = target > 100 ? 1990 : 0;
    const duration = 900;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const val = Math.round(
        start + (target - start) * (p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p),
      );
      el.textContent = val + suffix;
      el.classList.add("counting");
      setTimeout(() => el.classList.remove("counting"), 200);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  });
}

const aboutObs = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      aboutObs.disconnect();
    }
  },
  { threshold: 0.3 },
);
const aboutSection = document.getElementById("about");
if (aboutSection) aboutObs.observe(aboutSection);

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const secObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => {
          a.style.color =
            a.getAttribute("href") === "#" + entry.target.id ? "#f97acd" : "";
        });
      }
    });
  },
  { threshold: 0.45 },
);
sections.forEach((s) => secObs.observe(s));

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.1}px,${y * 0.1}px) translateY(-2px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ── TAG GLOW ── */
document.querySelectorAll(".tag").forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    tag.style.boxShadow = "0 0 16px rgba(240,64,160,0.22)";
  });
  tag.addEventListener("mouseleave", () => {
    tag.style.boxShadow = "";
  });
});

/* ── PHOTO AREA HINT ── */
const photoArea = document.getElementById("photoArea");
if (photoArea) {
  photoArea.addEventListener("click", () => {
    const h = photoArea.querySelector(".photo-hint");
    if (h) {
      h.textContent = "📁 See GUIDE.md to add your photo!";
      setTimeout(() => {
        h.textContent = "Add your photo here";
      }, 2500);
    }
  });
}

/* ── STAGGER SIBLINGS ── */
function stagger(parentSel, childSel) {
  document.querySelectorAll(parentSel).forEach((p) => {
    p.querySelectorAll(childSel).forEach((c, i) => {
      c.style.transitionDelay = i * 0.07 + "s";
    });
  });
}
stagger(".skill-tags", ".tag");
stagger(".certs-grid", ".cert-card");
stagger(".about-stats", ".stat-card");

/* ── PARTICLE BURST on project card hover ── */
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    for (let i = 0; i < 5; i++) {
      const p = document.createElement("span");
      const colors = ["#7c5cfc", "#f040a0", "#00e5bc", "#f5c542"];
      p.style.cssText = `position:absolute;width:5px;height:5px;border-radius:50%;pointer-events:none;background:${colors[i % colors.length]};left:${20 + Math.random() * 60}%;top:${20 + Math.random() * 60}%;transform:translate(-50%,-50%);z-index:10;animation:none;transition:all 0.5s ease-out`;
      card.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${(Math.random() - 0.5) * 80}px,${(Math.random() - 0.5) * 60}px) scale(0)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 500);
    }
  });
});
