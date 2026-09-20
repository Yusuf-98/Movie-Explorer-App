import { m } from 'framer-motion';
import { getImageUrl, formatDate } from '@/lib/utils';
import { IMAGE_SIZES } from '@/lib/constants';
import type { MovieDetailHeroProps } from '@/types/movie';
import calenderIcon from '../../assets/icons/calenderIcon.svg';
import { Button } from '../ui/button';
import PlayIcon from '../../assets/icons/play.png';
import FavoriteIcon from '../ui/FavoriteIcon';
import { MovieStats } from './MovieStats';

export function MovieDetailHero({
  movie,
  isFavorite,
  onToggleFavorite,
  onWatchTrailer,
}: MovieDetailHeroProps) {
  const backdropUrl = getImageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.large);
  const posterUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.large);

  const hasTrailer =
    movie.videos?.results?.some((v) => v.type === 'Trailer' && v.site === 'YouTube') ?? false;

  return (
    <div className="max-w-360 w-full min-h-98 mx-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-360 mt-103">
        <div className="flex flex-row items-start gap-6">
          {/* Poster */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0 w-11xl md:w-70 aspect-2/3 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </m.div>

          {/* Title + Release date */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6xl flex-1"
          >
            <div className="flex flex-col gap-md">
              <h1 className="text-size-display-xs md:text-size-display-2xl font-bold text-base-white">
                {movie.title}
              </h1>
              <div className="flex items-center gap-md text-neutral-400">
                <img src={calenderIcon} alt="" aria-hidden="true" className="w-5 h-5" />
                <span className="text-size-sm md:text-size-lg text-base-white">
                  {formatDate(movie.release_date)}
                </span>
              </div>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex flex-col gap-6xl">
              <div className="flex gap-xl items-center">
                {hasTrailer && (
                  <Button onClick={onWatchTrailer} className="w-56">
                    Watch Trailer
                    <img src={PlayIcon} alt="" aria-hidden="true" className="w-6 h-6" />
                  </Button>
                )}
                <Button
                  variant="favorite"
                  onClick={onToggleFavorite}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FavoriteIcon isFavorite={isFavorite} />
                </Button>
              </div>
              <MovieStats movie={movie} />
            </div>
          </m.div>
        </div>

        {/* Mobile buttons */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden flex flex-col gap-6xl mt-6xl"
        >
          <div className="flex gap-xl items-center">
            {hasTrailer && (
              <Button onClick={onWatchTrailer} className="flex-1">
                Watch Trailer
                <img src={PlayIcon} alt="" aria-hidden="true" className="w-6 h-6" />
              </Button>
            )}
            <Button
              variant="favorite"
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FavoriteIcon isFavorite={isFavorite} />
            </Button>
          </div>
          <MovieStats movie={movie} />
        </m.div>
      </div>
    </div>
  );
}
