# Movie Explorer

[![CI](https://github.com/Yusuf-98/Movie-Explorer-App/actions/workflows/ci.yml/badge.svg)](https://github.com/Yusuf-98/Movie-Explorer-App/actions/workflows/ci.yml)

A movie discovery app built on the TMDB API: browse trending and newly released movies, search, open a movie's details (cast, trailer, similar movies) and keep a favorites list that persists across sessions.

Built with React, TypeScript and Vite. The home page is prerendered at build time, so its content shows up before any JavaScript runs.

🚀 **Live demo:** https://movie-app-by-yusuf-ar.vercel.app/

<p align="center">
  <img src="docs/screenshots/home-hero.png" alt="Movie Explorer home page with hero banner" width="820">
</p>

[![Lighthouse](https://img.shields.io/badge/Lighthouse-99_mobile_%C2%B7_99_desktop-brightgreen?logo=lighthouse&logoColor=white)](#performance)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Home**: a hero banner that rotates through the top five trending movies every 6 seconds, a "Trending Now" carousel with rank badges, and a "New Release" grid of now-playing movies with "Load More"
- **Search**: results update as you type (debounced), with a validation message for queries shorter than two characters
- **Movie detail**: overview, rating, genres, cast and crew, similar movies, and the trailer in a modal
- **Favorites**: add or remove a movie from any card; the list is kept in localStorage across sessions

## Screenshots

| | |
| --- | --- |
| ![Trending Now](docs/screenshots/home-trending.png) | ![New Release](docs/screenshots/home-new-release.png) |
| **Trending Now** — ranked carousel | **New Release** — now-playing grid with "Load More" |
| ![Search](docs/screenshots/search.png) | ![Favorites](docs/screenshots/favorites.png) |
| **Search** — results as you type | **Favorites** — saved across sessions |
| ![Movie detail](docs/screenshots/detail-hero.png) | ![Cast and crew](docs/screenshots/detail-cast.png) |
| **Movie detail** — overview, rating and genres | **Cast and crew** |

![Trailer modal](docs/screenshots/trailer-modal.png)

*Trailer modal*

## Tech stack

- **React 19** + **TypeScript** + **Vite**, with build-time prerendering through React's server renderer
- **TanStack Query** for TMDB data (fetching, caching, and hydrating the prerendered cache)
- **Zustand** for favorites, persisted to localStorage
- **React Router** for routing, with route-level code splitting
- **Tailwind CSS v4** + **Radix UI** (shadcn/ui) for styling and accessible primitives
- **Framer Motion** for animations, **Embla** for the trending carousel
- **Zod** + **React Hook Form** for search validation
- **Axios** for the API client
- **Vitest** + **React Testing Library** for tests, **GitHub Actions** for CI

## Getting started

Requires Node.js 22 or newer.

```bash
git clone https://github.com/Yusuf-98/Movie-Explorer-App.git
cd Movie-Explorer-App
npm install
cp .env.example .env
```

Add your [TMDB API key](https://www.themoviedb.org/settings/api) to `.env`:

| Variable | Description |
| --- | --- |
| `VITE_TMDB_API_KEY` | Your TMDB API key (v3) |
| `VITE_TMDB_BASE_URL` | TMDB API base URL, `https://api.themoviedb.org/3` |
| `VITE_TMDB_IMAGE_BASE_URL` | TMDB image CDN base URL, `https://image.tmdb.org/t/p` |

Then start the dev server and open `http://localhost:5173`:

```bash
npm run dev
```

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, build the client and server bundles, then prerender the home page |
| `npm run build:ssr` | Build the server render entry only |
| `npm run prerender` | Prerender the home page into `dist/index.html` (after a build) |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite once |
| `npm run preview` | Preview the production build |

## Testing

Tests live next to the code they cover (`*.test.ts` / `*.test.tsx`) and run with Vitest and React Testing Library in jsdom:

- **Search validation**: the schema (an empty query is allowed, one character is rejected, two or more are accepted, over 100 is rejected) and the navbar search field, where the message appears for a one-character query and clears once the query is long enough or emptied.
- **Trailer modal**: closes on Escape and on the close button, and renders nothing when hidden.
- **Favorites store**: adding, ignoring duplicates, removing and toggling.
- **Utilities**: TMDB image URLs with a placeholder fallback, and date, runtime and currency formatting with "N/A" fallbacks.
- **Error boundary**: renders the fallback when a child throws, and navigates home from it.
- **Retry policy**: client errors (4xx, such as an unknown movie id) are never retried; network and server errors are retried once.

GitHub Actions runs lint, type-check, tests and the production build on every push and pull request to `main` ([ci.yml](.github/workflows/ci.yml)).

## Performance

Lighthouse results for the [live site](https://movie-app-by-yusuf-ar.vercel.app/): the median of 10 mobile runs and a single desktop run, both on 5 October 2026 (Lighthouse 13.5.0).

| | 📱 Mobile | 🖥️ Desktop |
| --- | :---: | :---: |
| **Performance** | **99** | **99** |
| **Accessibility** | **100** | **100** |
| **Best practices** | **100** | **100** |
| **SEO** | **100** | **100** |

Mobile performance ranged from 94 to 99 across the 10 runs, with 8 of them at 99.

### Core metrics

| Metric | 📱 Mobile | 🖥️ Desktop | Good if |
| --- | :---: | :---: | :---: |
| **First Contentful Paint** (first pixels) | 🟢 1.2 s | 🟢 0.5 s | ≤ 1.8 s |
| **Largest Contentful Paint** (main content visible) | 🟢 1.8 s | 🟢 0.8 s | ≤ 2.5 s |
| **Total Blocking Time** (page unresponsive) | 🟢 28 ms | 🟢 0 ms | ≤ 200 ms |
| **Cumulative Layout Shift** (content jumping) | 🟢 0 | 🟢 0 | ≤ 0.1 |
| **Speed Index** (how fast it fills in) | 🟢 2.5 s | 🟢 1.2 s | ≤ 3.4 s |
| **Page weight** (home page, compressed) | 472 KiB | 546 KiB | |

🟢 within Google's "good" range · mobile figures are medians, desktop figures are from a single run

### What "mobile" means in this test

The mobile test does not simply run on a fast laptop. Lighthouse slows the machine down to imitate a mid-range phone on a weak connection:

- **Device**: a Moto G Power (2022), 412 × 823 px screen at 1.75× pixel density.
- **Network**: simulated slow 4G, about **1.6 Mbps** download with **150 ms** of round-trip latency.
- **CPU**: slowed down **4×**, so JavaScript takes four times as long to run as it does on the laptop.

The desktop test uses a 1350 × 940 px screen, 10 Mbps, 40 ms latency and no CPU slowdown.

Run it yourself with [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmovie-app-by-yusuf-ar.vercel.app%2F&form_factor=mobile) or `npx lighthouse https://movie-app-by-yusuf-ar.vercel.app/ --form-factor=mobile`. A single run can move by a few points with network conditions, which is why the mobile figures above are a median of 10 runs.

### How it stays fast

- **Prerendered home page**: `npm run build` renders the home page to static HTML with this week's trending movies baked in ([scripts/prerender.mjs](scripts/prerender.mjs), [src/entry-server.tsx](src/entry-server.tsx)). Finished Suspense boundaries are written inline instead of behind a loading fallback, and the page wrapper is visible before hydration, so the hero appears from the HTML alone.
- **Scripts after the hero**: the app scripts are requested only once the hero image has been decoded and painted (with a 3-second fallback), so they never compete with it for bandwidth. React then hydrates the prerendered markup.
- **Hero banner**: the first slide's backdrop is downloaded at build time and served from the same origin as WebP (780 px on mobile, 1280 px on desktop through `<picture>`), preloaded with `fetchpriority="high"`.
- **Fonts**: the four Poppins weights are inlined into `index.html` as `@font-face` rules, so text needs no font request.
- **Below the fold**: the trending carousel is a separate chunk that renders its first three cards and reveals the rest as it scrolls; the "New Release" grid uses `content-visibility: auto` and fetches its data only when it is about to scroll into view.
- **Posters** are requested from TMDB at 185 px with a 342 px `srcset` candidate for high-density screens, lazy-loaded, and sized to the card.
- **Motion**: the hero fades in over 1 second starting from 10% opacity, so it already counts as painted when the fade begins.
- **Caching and splitting**: hashed files under `/assets` are served as immutable ([vercel.json](vercel.json)); the detail, search and favorites pages and the search form validation are lazy-loaded.

## API

Movie data comes from [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) v3. Paths are relative to `VITE_TMDB_BASE_URL`; every request carries the API key and `language=en-US` as query parameters.

| Screen | Endpoints used |
| --- | --- |
| Home | `GET /trending/movie/week` (hero and trending carousel, also fetched at build time for the prerender), `GET /movie/now_playing` (New Release, paged) |
| Search | `GET /search/movie` |
| Movie detail | `GET /movie/{id}` with `append_to_response=credits,videos,similar` |

Posters and backdrops are loaded from `VITE_TMDB_IMAGE_BASE_URL` at the size variants in [src/lib/constants.ts](src/lib/constants.ts). This product uses the TMDB API but is not endorsed or certified by TMDB.

## Project structure

```
scripts/              # Build step that prerenders the home page
src/
├── components/
│   ├── layout/       # Navbar, footer, search input
│   ├── movie/        # Hero, carousel, cards, grids, detail sections, trailer modal
│   └── ui/           # UI primitives (shadcn/ui on Radix)
├── context/          # Hero image override passed in by the prerender step
├── hooks/            # Data hooks (TanStack Query), useInView, useModalA11y
├── lib/              # Axios instance, constants, schemas, utilities
├── pages/            # Route-level pages
├── services/         # TMDB API calls
├── store/            # Zustand favorites store
├── test/             # Vitest setup
├── types/            # Shared types
├── entry-server.tsx  # Server render entry used by the prerender step
└── main.tsx          # Client entry that hydrates the prerendered page
```

## Deployment

Deployed on Vercel. `npm run build` type-checks, builds the client bundle and the server render entry, then runs [scripts/prerender.mjs](scripts/prerender.mjs), which fetches the trending movies from TMDB, downloads the first hero image and writes the rendered home page into `dist/index.html`. If that step fails, the normal client-only build is deployed instead. Set the three `VITE_TMDB_*` variables in the Vercel project's environment variables, since the build needs them too. [vercel.json](vercel.json) serves the hashed files under `/assets` with long-lived cache headers.

## Author

Built by [Yusuf AR](https://github.com/Yusuf-98).

## License

Licensed under the [MIT License](LICENSE).
