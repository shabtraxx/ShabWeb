# Shab — site

Landing page for Shab (Digital | Data | Cyber). Static Astro site, no runtime
dependencies, deployed to Cloudflare Pages.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
```

## Before launch — fill these in

Everything still wrapped in `[SQUARE BRACKETS]` renders visibly as a placeholder.
Most of them live in one file, `src/config.ts`:

| Value | Where |
|---|---|
| Booking link | `BOOKING_URL` — create a free Cal.com account, paste the link |
| Email, phone | `CONTACT` |
| Registered address, company number | `COMPANY` (legally required in the footer) |
| Public domain | `SITE_URL`, and the `Sitemap:` line in `public/robots.txt` |
| Client logos | `src/pages/index.astro`, the trust strip |
| Testimonial and attribution | `src/pages/index.astro`, the proof section |
| Social share image | `public/og.png` — export the hero artboard from the design canvas |

Until `BOOKING_URL` is set, the booking buttons point at the contact section
rather than a dead link.

`/privacy` is a starting point, not legal advice — have it reviewed.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Framework preset **Astro**; build command `npm run build`; output directory `dist`.
4. Deploy. Every push to the production branch ships; pull requests get preview URLs.
5. Add the custom domain under the project's **Custom domains** tab. HTTPS is automatic.

The Node version comes from `.nvmrc` — Cloudflare Pages reads it, and so does CI, so
there is one place to change it. Setting `NODE_VERSION` in the Pages dashboard as well
does no harm and acts as a belt-and-braces fallback.

Optional, free, no cookie banner: enable **Cloudflare Web Analytics** for the domain
and paste its snippet into `src/layouts/Base.astro`.

## Working on it

Trunk-based: `main` is always deployable, and every change arrives by pull
request from a short-lived feature branch.

```bash
git checkout main && git pull
git checkout -b feat/whatever
# ...work...
npm run check && npm run build && npm test
git push -u origin feat/whatever   # open a PR; CI runs; merge; delete the branch
```

CI (`.github/workflows/ci.yml`) runs on every pull request and on pushes to
`main`: typecheck, build, then the Playwright suite on desktop and mobile
viewports. Make these checks required in GitHub before merging — see the
repository settings note below.

### Tests

`tests/landing.spec.ts` covers the things that silently break a marketing page:

- one `<h1>`, a real title and a description long enough to be useful
- the three practices render
- every in-page anchor resolves to a section that exists
- no unfilled `[PLACEHOLDER]` leaks into a link target
- nothing loads from a third-party host (fonts stay self-hosted)
- no sideways scroll at either viewport
- the mobile nav opens, reports `aria-expanded`, closes on selection, and its
  hit target is at least 44px
- the first tab stop is the skip link, and the hidden mobile panel stays out of
  the tab order

Tests run against the built output, served by `scripts/serve-dist.mjs` — a
dependency-free foreground static server. (`astro preview` self-daemonizes,
which Playwright's `webServer` reads as a crash.) A sandbox with a preinstalled
browser can point at it with `CHROMIUM_PATH`; CI installs its own.

## Design of record

`Main.dc.html`, `Mobile.dc.html`, `Services.dc.html` and `canvas.json` are the design
artboards this site was built from. They are not part of the build — edit them through
the design canvas, not by hand.

## Notes

- Fonts (Space Grotesk, IBM Plex Sans) are self-hosted from `public/fonts`, latin subset
  only. Nothing is fetched from a third party at runtime.
- Design tokens live in `src/styles/tokens.css` and mirror the artboards exactly.
