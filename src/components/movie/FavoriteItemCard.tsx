import type { FavoriteItemProps } from '@/types/movie';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlayIcon from '../../assets/icons/play.png';
import { IMAGE_SIZES } from '@/lib/constants';
import { getImageUrl } from '@/lib/utils';
import { Button } from '../ui/button';
import FavoriteIcon from '../ui/FavoriteIcon';
import StarIcon from '../../assets/icons/star-yellow.png';

export default function FavoriteItem({
  movie,
  index,
  isFavorite,
  onRemove,
  onWatchTrailer,
}: FavoriteItemProps) {
  const posterUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className="w-full"
    >
      <div className="relative">
        {/* Favorite button */}
        <div className="hidden md:flex absolute top-0 right-0 z-10">
          <Button
            variant="favorite"
            isFavorite={isFavorite}
            onClick={() => onRemove(movie)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FavoriteIcon isFavorite={isFavorite} />
          </Button>
        </div>

        {/* poster + info */}
        <div className="flex flex-row gap-xl md:gap-3xl w-full mb-xl md:pr-14">
          {/* Poster */}
          <Link
            to={`/movie/${movie.id}`}
            className="shrink-0 overflow-hidden w-26 md:w-45.5 h-39 md:h-67.5 rounded-xl block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <img
              src={posterUrl}
              alt={movie.title}
              className="block w-full h-full object-cover"
              loading="lazy"
            />
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-xs md:gap-lg">
            {/* Title */}
            <h3 className="m-0 text-neutral-25 font-bold text-size-md md:text-size-display-xs line-clamp-2">
              <Link
                to={`/movie/${movie.id}`}
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded-sm"
              >
                {movie.title}
              </Link>
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-xs">
              <img src={StarIcon} alt="" aria-hidden="true" className="w-5 h-5" />
              <span className="text-neutral-25 text-size-sm md:text-size-lg font-medium">
                {movie.vote_average.toFixed(1)}/10
              </span>
            </div>

            {/* Overview */}
            <p className="m-0 text-neutral-400 text-size-sm md:text-size-md line-clamp-2">
              {movie.overview || 'No overview available.'}
            </p>

            {/* Desktop: Watch Trailer */}
            <div className="hidden md:flex mt-xl">
              <Button
                type="button"
                variant="default"
                onClick={() => onWatchTrailer(movie)}
                className="w-50"
              >
                Watch Trailer
                <img src={PlayIcon} alt="" aria-hidden="true" className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile: buttons row */}
        <div className="flex md:hidden flex-row items-center gap-lg w-full">
          <Button
            type="button"
            variant="default"
            onClick={() => onWatchTrailer(movie)}
            className="flex-1"
          >
            Watch Trailer
            <img src={PlayIcon} alt="" aria-hidden="true" className="w-6 h-6" />
          </Button>
          <Button
            variant="favorite"
            isFavorite={isFavorite}
            onClick={() => onRemove(movie)}
            className="shrink-0"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FavoriteIcon isFavorite={isFavorite} />
          </Button>
        </div>
      </div>
    </m.div>
  );
}
