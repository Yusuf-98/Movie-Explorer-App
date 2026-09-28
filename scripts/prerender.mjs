import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT, 'dist/index.html');
const RENDER_TIMEOUT_MS = 15_000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Prerender timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function main() {
  const template = await readFile(INDEX_HTML_PATH, 'utf-8');

  const entryServerUrl = pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js'));
  const { renderPage } = await import(entryServerUrl);

  const { html, dehydratedState } = await withTimeout(renderPage('/'), RENDER_TIMEOUT_MS);

  const stateJson = JSON.stringify(dehydratedState).replace(/</g, '\\u003c');
  const stateScript = `<script>window.__REACT_QUERY_STATE__=${stateJson};</script>`;

  const finalHtml = template
    .replace('<!--ssr-outlet-->', html)
    .replace('<!--ssr-state-->', stateScript);

  await writeFile(INDEX_HTML_PATH, finalHtml, 'utf-8');
  console.log('[prerender] dist/index.html updated with baked-in Homepage data.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(
      '[prerender] Prerender step failed — deploying the client-only shell instead ' +
        '(dist/index.html is left as the normal SPA build produced by `vite build`):',
      error
    );
    process.exit(0);
  });
