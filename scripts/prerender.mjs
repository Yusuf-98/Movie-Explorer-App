import { readFile, writeFile } from 'node:fs/promises';
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

const FONT_WEIGHTS = [400, 500, 600, 700];
const FONTSOURCE_FILES_DIR = path.join(ROOT, 'node_modules/@fontsource/poppins/files');

async function buildInlineFontStyle() {
  const faces = await Promise.all(
    FONT_WEIGHTS.map(async (weight) => {
      const filePath = path.join(FONTSOURCE_FILES_DIR, `poppins-latin-${weight}-normal.woff2`);
      const bytes = await readFile(filePath);
      const base64 = bytes.toString('base64');
      return (
        `@font-face{font-family:'Poppins';font-style:normal;font-display:swap;` +
        `font-weight:${weight};src:url(data:font/woff2;base64,${base64}) format('woff2')}`
      );
    })
  );
  return `<style>${faces.join('')}</style>`;
}

async function main() {
  let template = await readFile(INDEX_HTML_PATH, 'utf-8');

  const inlineFontStyle = await buildInlineFontStyle();
  const fontEagerLoadScript =
    `<script>` +
    FONT_WEIGHTS.map((w) => `document.fonts.load('${w} 16px Poppins');`).join('') +
    `</script>`;
  template = template.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    ${inlineFontStyle}\n    ${fontEagerLoadScript}`
  );

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

  if (heroImageOverride) {
    const heroPreloadTags =
      `<link rel="preload" as="image" href="${heroImageOverride.mobileSrc}" media="(max-width: 1023px)" fetchpriority="high">\n    ` +
      `<link rel="preload" as="image" href="${heroImageOverride.desktopSrc}" media="(min-width: 1024px)" fetchpriority="high">`;
    template = template.replace('</head>', `    ${heroPreloadTags}\n  </head>`);
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
