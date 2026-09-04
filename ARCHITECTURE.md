# Architecture

How this site is put together, and why. Read this before changing anything
structural — several decisions look arbitrary until you know what they are
protecting against.

## What it is

A static marketing site for Shab, built with [Astro](https://astro.build) and
served by Cloudflare Pages. No server, no database, no runtime dependencies.
Every page is HTML on disk by the time a visitor asks for it.

The whole site is two pages: the landing page and a privacy policy.

## Layout

```
src/
  config.ts            Every real-world value: domain, email, ABN, booking URL
  data/services.ts     Service pillars, process steps, sectors
  layouts/Base.astro   <head>, meta, fonts, skip link, header + footer
  components/          Header, Footer, Wordmark, ServiceCard, SectorIcon
  pages/               index.astro, privacy.astro
  styles/
    tokens.css         Colours, type ramp, spacing — the design system
    global.css         Reset, layout primitives, buttons
    fonts.css          @font-face for the self-hosted faces
public/
  fonts/               Space Grotesk + IBM Plex Sans, woff2, latin subset
  og.png               Social share card, generated — see below
scripts/
  render-og.mjs        Regenerates public/og.png (npm run og)
  serve-dist.mjs       Static server for the test suite
tests/                 Playwright specs, run against the built output
*.dc.html, canvas.json The design canvas — see "Design of record"
```

## Decisions worth knowing

**One file holds every real-world value.** `src/config.ts` carries the domain,
contact email, ABN, address and booking URL. `isSet()` tells whether a value is
still a `[PLACEHOLDER]`, and components branch on it — an unfilled email renders
as visibly bracketed text rather than a broken `mailto:` link. When a value
lands, one edit updates every page that uses it.

**Fonts are self-hosted.** `public/fonts` holds woff2 subsets rather than
linking to Google Fonts. That removes a third-party request from every page
load, which is both faster and simpler to describe truthfully in the privacy
policy. A test asserts the page makes no third-party requests at all, so
reintroducing a CDN font would fail CI.

**No cookies, anywhere.** The site sets none. Cloudflare Web Analytics is
enabled at the Pages project level — Cloudflare injects the beacon at deploy
time, so it appears in the served HTML but not in this repo. It is cookieless
and aggregate-only, which is why the site needs no consent banner.

**The Node version lives in `.nvmrc`.** CI reads it via `node-version-file`, and
Cloudflare Pages reads the same file when it builds. One value, two consumers.
Keep it at or above what the dependency tree requires — Astro pulls in `undici`,
which currently wants `>= 22.19.0`.

**Design tokens are CSS custom properties**, not Sass variables or a config
object. `src/styles/tokens.css` is the single place colours and the type ramp
are defined; everything else references them. Values were lifted from the design
artboards exactly rather than rounded to a grid.

## The share card is generated, not drawn

`public/og.png` is committed, but it is an output. `npm run og` regenerates it
from `scripts/render-og.mjs`, which renders HTML in a headless browser at
1200×630 with the fonts inlined as base64 — no server, no network, same PNG on
any machine.

Change the card design in that script, re-run it, commit both. The tests assert
the file exists at the declared size, because an `og:image` pointing at nothing
is invisible until someone shares a link and gets a broken preview.

## Design of record

The `.dc.html` files and `canvas.json` at the repo root are design artboards,
not site source. They are excluded from the build and describe the same pages in
a form that can be edited visually on a design canvas.

They are kept at the root because the tooling that seeds the canvas expects
working files alongside each other. They drift easily — if you change the site,
change them, or the canvas quietly becomes a picture of an older site.

## Testing

Playwright, run against the **built output** rather than a dev server, because
the built output is what deploys. `scripts/serve-dist.mjs` serves `dist/` in the
foreground; `astro preview` self-daemonizes, which Playwright reads as a crashed
server.

The suite targets the failures that are quiet rather than loud:

- every in-page anchor resolves to a section that exists
- no unfilled `[PLACEHOLDER]` leaks into a link target
- no booking button falls back to the contact anchor
- nothing loads from a third-party host
- no horizontal scroll at either viewport
- the mobile nav opens, reports `aria-expanded` and closes on selection
- the first tab stop is the skip link
- `og:image` resolves to a served PNG at exactly 1200×630
- the privacy page names every provider and carries a last-updated date

A sandbox with a preinstalled browser can point at it with `CHROMIUM_PATH`; CI
installs its own.

## Deployment

Push to `main` → Cloudflare Pages builds (`npm run build`, output `dist`) →
live on `shab.com.au`. Pull requests get their own preview deployment.

CI runs typecheck, build and the full suite on every PR and every push to
`main`. A branch ruleset requires that check before merge, so `main` should
always be deployable.

## The bits that are not in this repo

Roughly half the system is Cloudflare configuration. It is invisible here, so
it is written down:

| Concern | Where it lives |
|---|---|
| `shab.com.au` apex | Pages custom domain, proxied CNAME to the Pages project |
| `shab.au`, both `www` hosts | Placeholder proxied `A` records at `192.0.2.1`, plus 301 redirect rules preserving the path |
| Email | Cloudflare Email Routing forwards `hello@shab.com.au` to an external mailbox. Receive-only — replies come from the destination address, not from `hello@` |
| SPF, DKIM, DMARC | DNS TXT records. DMARC is at `p=reject` |
| Analytics | Enabled on the Pages project; beacon injected at deploy |

The placeholder `A` records exist because a redirect rule only fires if traffic
reaches Cloudflare, and traffic only reaches Cloudflare if the hostname
resolves. `192.0.2.1` is a reserved documentation address — nothing listens
there, which is the point.

## Changing common things

| To change | Edit |
|---|---|
| Contact email, ABN, address, booking link | `src/config.ts` |
| Service pillars, process steps, sectors | `src/data/services.ts` |
| Colours, type scale, spacing | `src/styles/tokens.css` |
| The share card | `scripts/render-og.mjs`, then `npm run og` |
| Privacy policy | `src/pages/privacy.astro`, and bump `PRIVACY_UPDATED` |
| Node version | `.nvmrc` |

The privacy policy states what the site actually does, naming each provider. If
the hosting, analytics, scheduling or email provider changes, the policy text
has to change with it — there is a note at the top of that file listing exactly
which sentences.
