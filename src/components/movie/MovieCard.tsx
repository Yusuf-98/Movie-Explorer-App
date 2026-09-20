import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { m } from 'framer-motion';
import { useMovieStore } from '@/store/movieStore';
import { getImageUrl } from '@/lib/utils';
import { IMAGE_SIZES } from '@/lib/constants';
import type { MovieCardProps } from '@/types/movie';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/scrollToTop';

export function MovieCard({ movie, index = 0, showRank = false, rank }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useMovieStore();
  const fav = isFavorite(movie.id);
  const posterUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      className="group relative shrink-0"
    >
      <Link
        to={`/movie/${movie.id}`}
        onClick={scrollToTop}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {/* Poster */}
        <div className="relative flex flex-col overflow-hidden bg-base-black">
          {movie.poster_path ? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              className="w-54 h-80.75 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              <span className="text-4xl">🎬</span>
            </div>
          )}

          {/* Rank badge */}
          {showRank && rank !== undefined && (
            <div className="absolute top-3 left-3 p-xs w-12 h-12 rounded-full flex items-center justify-center text-neutral-25 text-size-lg font-semibold bg-neutral-950/60 backdrop-blur-2xl">
              {rank}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-md">
            <p className="text-base-white text-size-xs line-clamp-4 leading-relaxed">
              {movie.overview || 'No synopsis available.'}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-xxs items-start mt-md">
          <p className="text-neutral-25 text-size-md md:text-size-lg font-semibold">
            {movie.title}
          </p>
          <div className="flex items-center gap-xs">
            <Star className="text-secondary-100 fill-secondary-100 w-4.5 h-4.5 md:w-5 md:h-5" />
            <span className="text-neutral-400 text-size-sm md:text-size-md">
              {movie.vote_average.toFixed(1)}/10
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(movie);
        }}
        className={cn(
          'absolute top-2 right-2 p-sm rounded-full backdrop-blur-sm transition-all duration-200 border-none cursor-pointer',
          'opacity-0 group-hover:opacity-100',
          fav ? 'bg-primary-300 opacity-100' : 'bg-black/60 hover:bg-primary-300'
        )}
        title={fav ? 'Remove from favorites' : 'Add to favorites'}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={14}
          className={cn('transition-colors', fav ? 'fill-white text-white' : 'text-white')}
        />
      </button>
    </m.div>
  );
}
