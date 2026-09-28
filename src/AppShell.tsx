import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { NotFoundState } from '@/components/movie/NotFoundState';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HomePage } from '@/pages/Homepage';

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

export function AppShell() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-neutral-950 text-white">
        <Navbar />
        <main>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}
