/* ============================================================
   Devona Accounting — site interactions
   - Mobile nav (hamburger)
   - Header shadow on scroll
   - Gentle hero entrance on page load (GSAP, load-only)
   - Contact form: front-end-only validation + success message
   Native scrolling only — no smooth-scroll / scroll hijacking,
   no scroll-triggered effects. Animations are progressive
   enhancement and respect prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      links.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });

    // Close when a link is tapped or on Escape / resize to desktop
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 640) close();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Hero load animation (GSAP, page-load only) ---------- */
  function initAnimations() {
    var hasGsap = typeof window.gsap !== "undefined";
    var noMotion = /[?&]nomotion\b/.test(window.location.search);

    // Reduced motion, no GSAP, or ?nomotion: leave everything fully visible & static.
    // Native scrolling is always used — no smooth-scroll / scroll hijacking.
    if (prefersReduced || !hasGsap || noMotion) return;

    var gsap = window.gsap;

    // Gentle hero entrance on page LOAD only (not tied to scrolling).
    var heroCopy = document.querySelectorAll(".hero-copy [data-hero]");
    var ledger = document.querySelector(".ledger-card[data-hero]");
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (heroCopy.length) {
      gsap.set(heroCopy, { opacity: 0, y: 22 });
      tl.to(heroCopy, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.08 });
    }
    if (ledger) {
      gsap.set(ledger, { opacity: 0, y: 26, scale: 0.98 });
      tl.to(ledger, { opacity: 1, y: 0, scale: 1, duration: 0.85 }, "-=0.5");
      var rows = ledger.querySelectorAll(".ledger-row, .ledger-card__foot");
      gsap.set(rows, { opacity: 0, x: 10 });
      tl.to(rows, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 }, "-=0.35");
    }

    // Failsafe: never let the hero (or the ledger rows inside it) stay hidden
    // if the load animation stalls for any reason.
    window.setTimeout(function () {
      document.querySelectorAll(
        ".hero [data-hero], .ledger-card .ledger-row, .ledger-card .ledger-card__foot"
      ).forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, 2000);
  }

  /* ---------- Contact form (front-end only) ---------- */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var success = document.getElementById("form-success");

    function setError(field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("has-error", !!on);
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      // Required fields
      form.querySelectorAll("[required]").forEach(function (el) {
        var empty = !el.value.trim();
        setError(el, empty);
        if (empty) ok = false;
      });

      // Email format
      var email = form.querySelector('input[type="email"]');
      if (email && email.value.trim() && !validEmail(email.value)) {
        setError(email, true);
        ok = false;
      }

      if (!ok) {
        var firstErr = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstErr) firstErr.focus();
        return;
      }

      /* -----------------------------------------------------------------
         PLACEHOLDER SUBMISSION — front-end only.
         No data is sent anywhere yet. To make this live, POST the form
         to your service (e.g. Formspree) using the endpoint configured
         on the <form data-form-endpoint="..."> attribute.

         Example (uncomment + add your endpoint):
         var endpoint = form.getAttribute("data-form-endpoint");
         fetch(endpoint, { method: "POST", body: new FormData(form),
           headers: { Accept: "application/json" } })
           .then(function () { ... });
         TODO: wire to Formspree / endpoint
      ----------------------------------------------------------------- */

      if (success) {
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
        success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      }
      form.reset();
    });

    // Clear error state as the user fixes a field
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && wrap.classList.contains("has-error")) wrap.classList.remove("has-error");
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeader();
    initAnimations();
    initForm();
    initYear();
  });
})();
