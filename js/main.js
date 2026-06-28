/* ============================================================
   Devona Accounting — site interactions
   - Mobile nav (hamburger)
   - Header shadow on scroll
   - Gentle hero entrance on page load (GSAP, load-only)
   - Consultation modal
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

  /* ---------- Consultation modal ---------- */
  function initConsultationModal() {
    if (document.getElementById("consultation-modal")) return;

    var modal = document.createElement("div");
    modal.className = "consultation-modal";
    modal.id = "consultation-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = [
      '<div class="consultation-modal__backdrop" data-modal-close></div>',
      '<section class="consultation-modal__panel" role="dialog" aria-modal="true" aria-labelledby="consultation-title" tabindex="-1">',
      '  <div class="consultation-modal__header">',
      '    <div>',
      '      <p class="eyebrow">Schedule a consultation</p>',
      '      <h2 id="consultation-title">How can we help?</h2>',
      '    </div>',
      '    <button class="modal-close" type="button" aria-label="Close consultation form" data-modal-close>&times;</button>',
      '  </div>',
      '  <div class="consultation-modal__body contact-grid">',
      '    <aside class="consultation-modal__info" aria-label="Contact details">',
      '      <div class="info-card">',
      '        <div class="info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>',
      '        <div><div class="label">Phone</div><a class="value" href="tel:+19362492518">936-249-2518</a></div>',
      '      </div>',
      '      <div class="info-card">',
      '        <div class="info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></div>',
      '        <div><div class="label">Email</div><a class="value" href="mailto:info@devonaaccounting.com">info@devonaaccounting.com</a></div>',
      '      </div>',
      '      <div class="info-card">',
      '        <div class="info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>',
      '        <div><div class="label">Service Area</div><div class="value">Serving local clients in the greater Huntsville and Madisonville, Texas area and remote clients nationwide</div></div>',
      '      </div>',
      '      <div class="info-card">',
      '        <div class="info-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>',
      '        <div><div class="label">Availability</div><div class="value">By appointment</div></div>',
      '      </div>',
      '    </aside>',
      '    <form class="form-card js-contact-form" novalidate data-form-endpoint="[CONTACT_FORM_DESTINATION]">',
      '      <div class="form-success" role="status">Thank you — your message has been received. We\'ll review your request and follow up with the appropriate next step.</div>',
      '      <div class="field"><label for="modal-name">Name <span class="req" aria-hidden="true">*</span></label><input type="text" id="modal-name" name="name" autocomplete="name" required /><div class="error-msg">Please enter your name.</div></div>',
      '      <div class="field-row">',
      '        <div class="field"><label for="modal-email">Email <span class="req" aria-hidden="true">*</span></label><input type="email" id="modal-email" name="email" autocomplete="email" required /><div class="error-msg">Please enter a valid email address.</div></div>',
      '        <div class="field"><label for="modal-phone">Phone</label><input type="tel" id="modal-phone" name="phone" autocomplete="tel" /><div class="error-msg">Please enter a valid phone number.</div></div>',
      '      </div>',
      '      <div class="field"><label for="modal-client-type">Are you an individual or business? <span class="req" aria-hidden="true">*</span></label><select id="modal-client-type" name="client-type" required><option value="" selected disabled>Please select...</option><option value="individual">Individual</option><option value="business">Business</option></select><div class="error-msg">Please choose an option.</div></div>',
      '      <div class="field"><label for="modal-help-type">What do you need help with? <span class="req" aria-hidden="true">*</span></label><select id="modal-help-type" name="help-type" required><option value="" selected disabled>Please select...</option><option value="individual-tax">Individual tax support</option><option value="business-tax">Small business tax support</option><option value="bookkeeping">Bookkeeping</option><option value="bookkeeping-cleanup">Bookkeeping cleanup</option><option value="freelancer-1099">Freelancer / 1099 support</option><option value="not-sure">Not sure yet</option></select><div class="error-msg">Please choose an option.</div></div>',
      '      <div class="field"><label for="modal-message">Message <span class="req" aria-hidden="true">*</span></label><textarea id="modal-message" name="message" required placeholder="Tell us a little about what you\'re looking for..."></textarea><div class="error-msg">Please enter a short message.</div></div>',
      '      <button type="submit" class="btn btn--gold">Send Message</button>',
      '      <p class="form-note">Please do not include full Social Security numbers, bank account numbers, or other highly sensitive information in this form. After your request is reviewed, we\'ll provide the appropriate next step for sharing documents securely.</p>',
      '    </form>',
      '  </div>',
      '</section>'
    ].join("");
    document.body.appendChild(modal);

    var panel = modal.querySelector(".consultation-modal__panel");
    var previousFocus = null;

    function getFocusable() {
      return Array.prototype.slice.call(modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function openModal() {
      previousFocus = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      window.setTimeout(function () {
        var firstField = modal.querySelector("#modal-name");
        (firstField || panel).focus();
      }, 0);
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("a");
      if (!trigger) return;
      var label = trigger.textContent.replace(/\s+/g, " ").trim().toLowerCase();
      if (label !== "schedule a consultation") return;
      e.preventDefault();
      openModal();
    });

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-modal-close]")) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- Contact form (front-end only) ---------- */
  function initForm() {
    var forms = document.querySelectorAll("#contact-form, .js-contact-form");
    if (!forms.length) return;

    function setError(field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("has-error", !!on);
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    forms.forEach(function (form) {
      var success = form.querySelector(".form-success");

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
    initConsultationModal();
    initForm();
    initYear();
  });
})();
