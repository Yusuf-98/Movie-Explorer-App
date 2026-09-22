import './index.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { NotFoundState } from '@/components/movie/NotFoundState';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HomePage } from '@/pages/Homepage';
import { trendingMoviesQueryOptions } from '@/hooks/useMovies';

// --- Lazy routes ---
const MovieDetailPage = lazy(() =>
  import('@/pages/DetailPage').then((mod) => ({ default: mod.MovieDetailPage }))
);
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritePage').then((mod) => ({ default: mod.FavoritesPage }))
);
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((mod) => ({ default: mod.SearchPage }))
);

function RouteFallback() {
  return (
    <div className="flex min-h-screen justify-center pt-40">
      <div className="w-8 h-8 border-2 border-neutral-25 border-t-neutral-800 rounded-full animate-spin" />
    </div>
  );
}

// --- Dev tools ---
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((d) => ({ default: d.ReactQueryDevtools }))
    )
  : () => null;

// --- Query client ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// --- Prefetch ---
if (window.location.pathname === '/') {
  void queryClient.prefetchQuery(trendingMoviesQueryOptions());
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundState />} />
          </Routes>
        </Suspense>
      </m.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation}>
        <BrowserRouter>
          <div className="min-h-screen bg-neutral-950 text-white">
            <Navbar />
            <main>
              <ErrorBoundary>
                <AnimatedRoutes />
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LazyMotion>
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
