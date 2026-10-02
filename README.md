# Movie Explorer

[![CI](https://github.com/Yusuf-98/Movie-App/actions/workflows/ci.yml/badge.svg)](https://github.com/Yusuf-98/Movie-App/actions/workflows/ci.yml)

A movie discovery app built with React and the TMDB API — browse popular and trending titles, search, view details (cast, trailers, similar movies), and keep a favorites list that persists across sessions.

🚀 **Live demo:** https://movie-app-by-yusuf-ar.vercel.app/

<p align="center">
  <img src="docs/screenshots/home-hero.png" alt="Movie Explorer home page with hero banner" width="820">
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

## Screenshots

| Trending Now | New Release |
| --- | --- |
| ![Trending Now](docs/screenshots/home-trending.png) | ![New Release](docs/screenshots/home-new-release.png) |

| Search | Favorites |
| --- | --- |
| ![Search](docs/screenshots/search.png) | ![Favorites](docs/screenshots/favorites.png) |

| Movie Detail | Cast & Crew | Trailer |
| --- | --- | --- |
| ![Movie detail](docs/screenshots/detail-hero.png) | ![Cast & crew](docs/screenshots/detail-cast.png) | ![Trailer modal](docs/screenshots/trailer-modal.png) |

## Features

- **Home** — popular, now playing, and trending movies
- **Search** — debounced search with validation
- **Movie Detail** — overview, rating, genres, cast & crew, similar movies, trailer playback
- **Favorites** — add/remove movies, persisted to localStorage

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack React Query** — data fetching & caching
- **Zustand** — favorites state, persisted to localStorage
- **React Router** — routing
- **Radix UI & shadcn/ui** — accessible UI primitives
- **Zod & React Hook Form** — search validation
- **Framer Motion** — animations & transitions
- **Tailwind CSS** — styling

## API

Movie data comes from [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api):

- `GET /trending/movie/week` — hero banner & trending row
- `GET /movie/popular` — home page grid
- `GET /movie/now_playing` — new release row
- `GET /search/movie` — search results
- `GET /movie/{id}` (with `append_to_response=credits,videos,similar`) — detail page

Images are served from TMDB's CDN at size variants defined in `src/lib/constants.ts`. This product uses the TMDB API but is not endorsed or certified by TMDB.

## Getting Started

```bash
git clone https://github.com/Yusuf-98/Movie-App.git
cd Movie-App
npm install
```

Copy `.env.example` to `.env` and add your [TMDB API key](https://www.themoviedb.org/settings/api):

```bash
cp .env.example .env
```

```env
VITE_TMDB_API_KEY=your_api_key_here
```

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Testing

```bash
npm run test
```

Runs the Vitest suite once (store logic, utility functions, search validation, the trailer modal, and the error boundary).

## Performance

- **Build-time prerendering** — the home page's trending data and markup are fetched and rendered to static HTML during `npm run build` (`scripts/prerender.mjs`), then hydrated on the client. No request round-trip is needed before the first paint.
- **Self-hosted hero image** — the first hero banner's image is downloaded at build time and served from the same origin as the page, removing a cross-origin connection from the critical rendering path.
- **Route-level code splitting** — detail, search, and favorites pages are lazy-loaded with `React.lazy`.

## Scripts

```bash
npm run dev       # start dev server
npm run build     # type-check + production build
npm run lint      # lint
npm run test      # run tests
npm run preview   # preview production build
```

## Project Structure

```
src/
├── components/       # Reusable components (feature + ui)
├── pages/            # Route-level page components
├── hooks/            # Custom React hooks
├── services/         # TMDB API service functions
├── store/            # Zustand stores
├── types/            # TypeScript types
└── lib/              # Axios instance, utilities, schemas
```

## Deployment

Deployed on [Vercel](https://vercel.com) as a static site. `npm run build` type-checks, builds the client bundle, builds the SSR entry, then runs the prerender step so `dist/` ships with the home page already rendered. `vercel.json` sets a one-year immutable cache on hashed assets under `/assets/`.

## Author

Built by [Yusuf AR](https://github.com/Yusuf-98).

## License

Licensed under the [MIT License](LICENSE).
