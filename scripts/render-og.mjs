/**
 * Renders the Open Graph card to public/og.png at 1200×630.
 *
 * The card is composed for the crop rather than screenshotted from the page —
 * a hero at card size reads as a squashed webpage in a feed.
 *
 * Fonts are inlined as base64 so the script has no server or network
 * dependency and produces the same PNG on any machine. Run it after changing
 * the card design or the wordmark:
 *
 *   npm run og
 *
 * A sandbox with a preinstalled browser can point at it with CHROMIUM_PATH;
 * elsewhere Playwright uses its own.
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = `${ROOT}public/og.png`;

const WIDTH = 1200;
const HEIGHT = 630;

const font = async (file) =>
  `data:font/woff2;base64,${(await readFile(`${ROOT}public/fonts/${file}`)).toString('base64')}`;

const display = await font('space-grotesk-latin.woff2');
const body = await font('ibm-plex-sans-400-latin.woff2');

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Space Grotesk';
    src: url(${display}) format('woff2');
    font-weight: 400 700;
  }
  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${body}) format('woff2');
    font-weight: 400;
  }

  * { box-sizing: border-box; margin: 0; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    display: flex;
    align-items: center;
    gap: 64px;
    padding: 72px 80px;
    background: #0d1015;
    color: #f2f4f6;
    font-family: 'IBM Plex Sans', sans-serif;
    overflow: hidden;
  }

  .copy {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    flex: 1;
  }

  /* Same lockup ratios as src/components/Wordmark.astro: the scale sets the
     size and both children size from it in em, so the strapline sits flush
     under the wordmark here exactly as it does in the header. */
  .lockup {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.09em;
    font-size: 72px;
  }

  .wordmark {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1em;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .strapline {
    font-size: 0.205em;
    letter-spacing: 0.06em;
    /* Drops the trailing letter-space, which would otherwise push the
       strapline visibly wider than the wordmark. */
    margin-right: -0.06em;
    line-height: 1.2;
    text-transform: uppercase;
    color: #8d959e;
  }

  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 62px;
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.025em;
    color: #f7f9fa;
    max-width: 15ch;
  }

  .foot {
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 20px;
    color: #b8c0c8;
  }

  .rule {
    width: 40px;
    height: 2px;
    background: #3fd0d4;
  }

  .mark {
    flex: none;
    line-height: 0;
  }
</style>
<div class="copy">
  <div class="lockup">
    <div class="wordmark">Shab</div>
    <div class="strapline">Digital | Data | Cyber</div>
  </div>

  <h1>Decisions your board can stand behind.</h1>

  <div class="foot">
    <span class="rule"></span>
    <span>shab.com.au</span>
  </div>
</div>

<div class="mark">
  <svg width="340" height="340" viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 95H380M0 190H380M0 285H380M95 0V380M190 0V380M285 0V380" stroke="rgba(255,255,255,0.05)"></path>
    <path d="M190 46L306 96V196C306 262 254 316 190 336C126 316 74 262 74 196V96L190 46Z" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"></path>
    <path d="M190 96L258 125V193C258 234 228 267 190 281C152 267 122 234 122 193V125L190 96Z" stroke="#3fd0d4" stroke-width="2"></path>
    <path d="M158 190L182 214L226 166" stroke="#3fd0d4" stroke-width="2.6" stroke-linecap="square"></path>
    <circle cx="190" cy="46" r="4" fill="#3fd0d4"></circle>
    <circle cx="306" cy="96" r="4" fill="rgba(255,255,255,0.3)"></circle>
    <circle cx="74" cy="96" r="4" fill="rgba(255,255,255,0.3)"></circle>
  </svg>
</div>
`;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await browser.close();

await writeFile(OUT, png);
console.log(`wrote public/og.png — ${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB`);
