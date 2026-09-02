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

Optional, free, no cookie banner: enable **Cloudflare Web Analytics** for the domain
and paste its snippet into `src/layouts/Base.astro`.

## Design of record

`Main.dc.html`, `Mobile.dc.html`, `Services.dc.html` and `canvas.json` are the design
artboards this site was built from. They are not part of the build — edit them through
the design canvas, not by hand.

## Notes

- Fonts (Space Grotesk, IBM Plex Sans) are self-hosted from `public/fonts`, latin subset
  only. Nothing is fetched from a third party at runtime.
- Design tokens live in `src/styles/tokens.css` and mirror the artboards exactly.
