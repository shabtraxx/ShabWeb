/**
 * Minimal foreground static server for the built site.
 *
 * `astro preview` self-daemonizes, so the foreground process exits immediately
 * and Playwright's webServer treats that as a crash. This stays in the
 * foreground and behaves identically locally and in CI. No dependencies.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROOT = new URL('../dist/', import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

/** Resolve a request path to a file inside dist/, or null if it escapes or is missing. */
async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const candidates = clean.endsWith('/')
    ? [join(clean, 'index.html')]
    : [clean, join(clean, 'index.html'), `${clean}.html`];

  for (const candidate of candidates) {
    const path = join(ROOT, candidate);
    if (!path.startsWith(ROOT)) continue;
    try {
      const info = await stat(path);
      if (info.isFile()) return path;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

createServer(async (request, response) => {
  const path = await resolve(request.url ?? '/');

  if (!path) {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(response);
}).listen(PORT, () => {
  console.log(`serving dist/ on http://localhost:${PORT}`);
});
