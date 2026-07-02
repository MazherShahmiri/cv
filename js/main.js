/* Kairos — interactions */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header scrolled state ---------- */
  var head = document.querySelector(".site-head");
  function onScroll() {
    head.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a") && nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- build cohort grid (analytics section) ---------- */
  var cohort = document.querySelector("[data-cohort]");
  if (cohort) {
    // 6 cohort rows x 8 months; retention decays right, one deliberate gap cell
    var heat = [
      [0.95, 0.62, 0.44, 0.36, 0.30, 0.26, 0.22, 0.20],
      [0.95, 0.66, 0.48, 0.38, 0.31, 0.27, 0.24, 0.21],
      [0.95, 0.64, 0.45, 0.05, 0.28, 0.25, 0.22, 0.19],
      [0.95, 0.68, 0.50, 0.40, 0.34, 0.29, 0.25, 0.22],
      [0.95, 0.70, 0.52, 0.43, 0.36, 0.31, 0.27, 0.24],
      [0.95, 0.72, 0.55, 0.46, 0.39, 0.34, 0.29, 0.26]
    ];
    var html = "";
    for (var r = 0; r < heat.length; r++) {
      for (var c = 0; c < heat[r].length; c++) {
        var isGap = r === 2 && c === 3;
        var delay = (r * 8 + c) * 0.018;
        html += '<span class="c' + (isGap ? " gap-cell" : "") + '" style="--h:' +
          heat[r][c] + ";--d:" + delay.toFixed(3) + 's"></span>';
      }
    }
    cohort.innerHTML = html;
  }

  /* ---------- seamless marquee: clone track ---------- */
  var track = document.querySelector("[data-marquee]");
  if (track) {
    var clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.parentNode.appendChild(clone);
  }

  /* ---------- measure line lengths so sv-draw animates correctly ---------- */
  document.querySelectorAll(".sv-draw").forEach(function (p) {
    try {
      var len = Math.ceil(p.getTotalLength()) + 2;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reducedMotion ? 0 : len;
    } catch (e) { /* non-path elements: keep CSS defaults */ }
  });

  /* ---------- reveal + chart trigger ---------- */
  var revealables = document.querySelectorAll(
    ".reveal, .kpi, .service, .cohort-panel, .results-chart-panel, .chart-card, .dash, .case, .step"
  );
  var io = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        // inline dashoffset (set above for measuring) beats the CSS rule, so release it here
        entry.target.querySelectorAll(".sv-draw").forEach(function (p) {
          p.style.strokeDashoffset = "0";
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );
  revealables.forEach(function (el) { io.observe(el); });

  /* ---------- count-up numbers ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reducedMotion) { el.textContent = target; return; }
    var dur = target > 99 ? 1600 : 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counts = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.7 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) { counts.observe(el); });

  /* ---------- booking form ---------- */
  var form = document.getElementById("audit-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      var key = form.querySelector('[name="access_key"]').value;
      if (key === "YOUR-WEB3FORMS-KEY") {
        // form not wired to an inbox yet — fall back to email so no lead is lost
        e.preventDefault();
        status.className = "form-status err";
        status.textContent = "Form isn't connected yet — email us instead: hello@YOUR-DOMAIN.com";
        return;
      }
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";
      var data = new FormData(form);
      fetch(form.action, { method: "POST", body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            status.className = "form-status ok";
            status.textContent = "Got it — we'll reply within one business day.";
            form.reset();
          } else { throw new Error(); }
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Something went wrong — email us at hello@YOUR-DOMAIN.com";
        });
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("#year").forEach(function (y) {
    y.textContent = String(new Date().getFullYear());
  });
})();
