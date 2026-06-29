# Devona Accounting — Website

A clean, responsive marketing website for a local Texas tax & bookkeeping
professional. Built as plain HTML, CSS, and JavaScript — **no build step and no
dependencies to install.** Modern animation is added through CDN-loaded
libraries (GSAP, ScrollTrigger, Lenis) and degrades gracefully.

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `about.html` | About |
| `services.html` | Services |
| `contact.html` | Contact |

Shared assets: `css/styles.css`, `js/main.js`, and `assets/`:

| Asset | Use |
|-------|-----|
| `logo-wordmark.png` | Full "Devona Accounting" lockup (color) — header, on the cream bar |
| `logo-wordmark-light.png` | Cream/reversed lockup — footer, on the dark background |
| `favicon.png` | 64px browser tab icon (the R/A monogram) |
| `logo-wordmark-source.png` | Full-resolution transparent wordmark (source) |
| `logo.png`, `logo-source.png`, `logo-lockup.png` | Earlier monogram/lockup assets, kept for print/social |

## Viewing the site

**Easiest:** double-click `index.html` to open it in your browser.

**Recommended (clean preview over http://):** from this folder, run a tiny
local server so everything behaves exactly like a real host:

```bash
cd ~/Documents/taxbookkeeping-website
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Customizing — replace the placeholders

The business name is set to **Devona Accounting** (from the logo). These
bracketed placeholders still need real values — find-and-replace them across all
`.html` files:

| Placeholder | Meaning |
|-------------|---------|
| `[OWNER_NAME]` | Owner name (About page intro) |
| `[CITY_OR_SERVICE_AREA]` | Service area, e.g. serving local clients in the greater Huntsville and Madisonville, Texas area and remote clients nationwide |
| `[PHONE_NUMBER]` | Phone (also used in `tel:` links) |
| `info@devonaaccounting.com` | Email (also used in `mailto:` links) |
| `https://formsubmit.co/ajax/admin@devonaaccounting.com` | Contact form destination |

Quick way to find them all:

```bash
grep -rn "\[OWNER_NAME\]\|\[CITY_OR_SERVICE_AREA\]\|\[PHONE_NUMBER\]\|\[EMAIL_ADDRESS\]\|\[CONTACT_FORM_DESTINATION\]" .
```

## Contact form

The form submits through FormSubmit's AJAX endpoint and sends requests to
`admin@devonaaccounting.com`, with `billydevona@gmail.com` copied for testing.

FormSubmit may send an activation email to `admin@devonaaccounting.com` the
first time the form is submitted. Approve that email to start receiving
submissions.

## Animations

`js/main.js` loads GSAP + ScrollTrigger + Lenis from a CDN for subtle
scroll-reveals and smooth scrolling. Notes:

- If the libraries fail to load, or the visitor has **"Reduce Motion"** enabled,
  all content stays fully visible — animations are purely an enhancement.
- **Going fully offline?** Download the three library files, drop them in a
  `vendor/` folder, and change the `<script src="https://…">` tags at the bottom
  of each HTML page to point at the local copies.
- **Debug tip:** append `?nomotion=1` to any page URL to disable the JS
  animations and see the final, fully-revealed layout (handy for screenshots).

## Visual identity

Concept: **"books in order."** Deep burgundy/wine + warm cream + antique gold —
matched to the Devona Accounting logo — with **Fraunces** (serif display) and
**Hanken Grotesk** (body) from Google Fonts. The recurring ledger motif — ruled
hairlines, tabular figures, the hero's "Monthly Overview" card — comes from the
bookkeeping subject itself. Keep that restraint if you extend the design.

## Hosting

This is a static site — host it anywhere:

- **Netlify:** drag the folder onto the Netlify dashboard.
- **GitHub Pages:** push the folder to a repo and enable Pages.
- **Any web host:** upload the files to your web root.

## Content & positioning notes

Copy intentionally avoids overpromising and credential claims (no "CPA," "guaranteed
refund," etc.). Keep that tone if you edit the copy. The footer disclaimer and the
contact-form privacy note should remain on the site.
