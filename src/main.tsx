import { StrictMode, startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { hydrate as hydrateQueryState, type DehydratedState } from '@tanstack/react-query';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import './index.css';
import App from './App.tsx';
import { createAppQueryClient } from '@/lib/queryClient';
import { useMovieStore } from '@/store/movieStore';
import type { HeroImageOverride } from '@/context/HeroImageOverride';

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: DehydratedState;
    __HERO_IMAGE__?: HeroImageOverride;
  }
}

const container = document.getElementById('root')!;
const queryClient = createAppQueryClient();

const dehydratedState = window.__REACT_QUERY_STATE__;
const heroImageOverride = window.__HERO_IMAGE__ ?? null;
const wasPrerendered = !!dehydratedState && window.location.pathname === '/';

if (dehydratedState) {
  hydrateQueryState(queryClient, dehydratedState);
  delete window.__REACT_QUERY_STATE__;
  delete window.__HERO_IMAGE__;
}

const app = (
  <StrictMode>
    <App queryClient={queryClient} heroImageOverride={wasPrerendered ? heroImageOverride : null} />
  </StrictMode>
);

startTransition(() => {
  if (wasPrerendered) {
    hydrateRoot(container, app);
  } else {
    container.innerHTML = '';
    createRoot(container).render(app);
  }
});

void useMovieStore.persist.rehydrate();
