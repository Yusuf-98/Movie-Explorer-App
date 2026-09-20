import { m } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import type { MovieGridProps } from '@/types/movie';

export function MovieGrid({ movies, isLoading, title, skeletonCount = 15 }: MovieGridProps) {
  return (
    <section>
      {/* Title */}
      <div className="w-full flex flex-col gap-3xl md:gap-4xl lg:gap-5xl">
        {title && (
          <m.h2
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-neutral-25 font-bold text-size-display-xs md:text-size-display-md lg:text-size-display-lg"
          >
            {title}
          </m.h2>
        )}
        {/* Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-xl md:gap-2xl">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : !movies?.length ? (
          <div className="flex flex-col items-center justify-center py-9xl text-neutral-600">
            <span className="text-5xl mb-xl">🎬</span>
            <p className="text-size-lg font-medium text-neutral-400">No movies found</p>
            <p className="text-size-sm mt-xs text-neutral-600">Try other keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-xl md:gap-2xl">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
