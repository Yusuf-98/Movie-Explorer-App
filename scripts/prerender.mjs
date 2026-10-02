import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT, 'dist/index.html');
const ASSETS_DIR = path.join(ROOT, 'dist/assets');
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const RENDER_TIMEOUT_MS = 15_000;
const IMAGE_TIMEOUT_MS = 10_000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
  ]);
}

const EXTENSION_BY_CONTENT_TYPE = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

async function downloadHeroImage(backdropPath, size) {
  const res = await fetch(`${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`, {
    headers: { Accept: 'image/webp' },
  });
  if (!res.ok) throw new Error(`Hero image download failed: ${res.status}`);
  const contentType = res.headers.get('content-type');
  const extension = EXTENSION_BY_CONTENT_TYPE[contentType];
  if (!extension) throw new Error(`Unrecognized hero image content-type: ${contentType}`);
  return { bytes: Buffer.from(await res.arrayBuffer()), extension };
}

async function buildHeroImageOverride(firstMovie) {
  if (!firstMovie?.backdrop_path) return null;

  const [mobile, desktop] = await withTimeout(
    Promise.all([
      downloadHeroImage(firstMovie.backdrop_path, 'w780'),
      downloadHeroImage(firstMovie.backdrop_path, 'w1280'),
    ]),
    IMAGE_TIMEOUT_MS,
    'Hero image download'
  );

  const mobileName = `hero-${firstMovie.id}-mobile.${mobile.extension}`;
  const desktopName = `hero-${firstMovie.id}-desktop.${desktop.extension}`;

  await writeFile(path.join(ASSETS_DIR, mobileName), mobile.bytes);
  await writeFile(path.join(ASSETS_DIR, desktopName), desktop.bytes);

  return {
    movieId: firstMovie.id,
    mobileSrc: `/assets/${mobileName}`,
    desktopSrc: `/assets/${desktopName}`,
  };
}

async function buildFontPreloadTags() {
  const files = await readdir(ASSETS_DIR);
  const fontFiles = files.filter((f) => /^poppins-latin-\d+-normal-.*\.woff2$/.test(f));
  return fontFiles
    .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin>`)
    .join('\n    ');
}

async function main() {
  let template = await readFile(INDEX_HTML_PATH, 'utf-8');

  const fontPreloadTags = await buildFontPreloadTags();
  if (fontPreloadTags) {
    template = template.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    ${fontPreloadTags}`
    );
  }

  const entryServerUrl = pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js'));
  const { prefetchTrending, renderWithData } = await import(entryServerUrl);

  const { queryClient, firstMovie } = await withTimeout(
    prefetchTrending(),
    RENDER_TIMEOUT_MS,
    'Trending prefetch'
  );

  let heroImageOverride = null;
  try {
    heroImageOverride = await buildHeroImageOverride(firstMovie);
  } catch (error) {
    console.error('[prerender] Hero image self-host failed, falling back to TMDB URLs:', error);
  }

  const { html, dehydratedState } = await withTimeout(
    renderWithData(queryClient, heroImageOverride, '/'),
    RENDER_TIMEOUT_MS,
    'Render'
  );

  const stateJson = JSON.stringify(dehydratedState).replace(/</g, '\\u003c');
  const heroJson = JSON.stringify(heroImageOverride).replace(/</g, '\\u003c');
  const stateScript =
    `<script>window.__REACT_QUERY_STATE__=${stateJson};` +
    (heroImageOverride ? `window.__HERO_IMAGE__=${heroJson};` : '') +
    `</script>`;

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
