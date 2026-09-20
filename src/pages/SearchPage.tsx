import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import type { Movie } from '@/types/movie';
import { Toast } from '../components/ui/Toast';
import { SearchSkeleton } from '@/components/ui/SearchSkeleton';
import SearchResultItem from '@/components/movie/SearchResult';
import { NotFoundState } from '@/components/movie/NotFoundState';
import { InitState } from '@/components/movie/InitState';
import { TrailerModalFromStore } from '@/components/movie/TrailerModalFromStore';
import { useSearchMovies } from '@/hooks/useMovies';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q')?.trim() ?? '';

  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { data, isLoading } = useSearchMovies(queryFromUrl);
  const results = data?.results ?? [];

  const closeToast = useCallback(() => {
    setToast((p) => ({ ...p, visible: false }));
  }, []);

  const hasQuery = queryFromUrl.length >= 2;
  const notFound = hasQuery && !isLoading && results.length === 0;
  const found = hasQuery && !isLoading && results.length > 0;

  return (
    <div className="bg-base-black min-h-screen flex flex-col">
      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} />

      {/* Results */}
      <div className="flex-1 px-xl md:px-11xl pt-32.5">
        <AnimatePresence mode="wait">
          {isLoading && hasQuery ? (
            <SearchSkeleton key="skeleton" />
          ) : found ? (
            <m.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {results.map((movie, i) => (
                <div key={movie.id}>
                  <SearchResultItem
                    movie={movie}
                    index={i}
                    onWatchTrailer={(m: Movie) => setTrailerMovie(m)}
                  />
                  {/* Divider */}
                  {i !== results.length - 1 && (
                    <div className="w-full h-px bg-neutral-800 my-6xl" />
                  )}
                </div>
              ))}
            </m.div>
          ) : notFound ? (
            <NotFoundState key="notfound" />
          ) : (
            <InitState key="init" />
          )}
        </AnimatePresence>
      </div>

      {/* Trailer modal */}
      {trailerMovie && (
        <TrailerModalFromStore
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
          onNoTrailer={() => setToast({ visible: true, message: 'No trailer available' })}
        />
      )}
    </div>
  );
}
