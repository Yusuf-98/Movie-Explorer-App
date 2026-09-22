import { m } from 'framer-motion';
import { useMovieStore } from '@/store/movieStore';
import { getImageUrl } from '@/lib/utils';
import { IMAGE_SIZES } from '@/lib/constants';
import { Link } from 'react-router-dom';
import type { SearchResultItemProps } from '@/types/movie';
import PlayIcon from '../../assets/icons/play.png';
import StarIcon from '../../assets/icons/star-yellow.png';
import { Button } from '../ui/button';
import FavoriteIcon from '../ui/FavoriteIcon';

export default function SearchResultItem({ movie, index, onWatchTrailer }: SearchResultItemProps) {
  const { isFavorite, toggleFavorite } = useMovieStore();
  const fav = isFavorite(movie.id);
  const posterUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative w-full bg-neutral-900 rounded-2xl p-xl md:p-3xl"
    >
      {/* Favorite button */}
      <div className="hidden md:block absolute top-xl right-xl z-10">
        <Button
          variant="favorite"
          isFavorite={fav}
          onClick={() => toggleFavorite(movie)}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FavoriteIcon isFavorite={fav} />
        </Button>
      </div>

      {/* Row: poster + info */}
      <div className="flex flex-row gap-xl mb-xl md:pr-14">
        {/* Poster */}
        <Link
          to={`/movie/${movie.id}`}
          className="shrink-0 aspect-2/3 rounded-lg overflow-hidden bg-neutral-800 w-23 md:w-33 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
        >
          {movie.poster_path ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-3xl">
              🎬
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-xs">
          {/* Title */}
          <h3 className="m-0 text-neutral-25 font-bold text-size-md md:text-size-display-xs leading-snug line-clamp-2">
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
            <span className="text-neutral-25 font-medium text-size-xs md:text-size-sm">
              {movie.vote_average.toFixed(1)}/10
            </span>
          </div>

          {/* Overview */}
          <p className="m-0 text-neutral-400 text-size-xs md:text-size-sm leading-relaxed line-clamp-2">
            {movie.overview || 'No overview available.'}
          </p>
        </div>
      </div>

      {/* Bottom: Watch Trailer + Favorite mobile */}
      <div className="flex flex-row items-center gap-lg">
        <Button
          type="button"
          variant="default"
          onClick={() => onWatchTrailer(movie)}
          className="flex-1 md:flex-none md:w-50"
        >
          Watch Trailer
          <img src={PlayIcon} alt="" aria-hidden="true" className="w-6 h-6" />
        </Button>

        {/* Favorite — mobile only */}
        <div className="flex md:hidden">
          <Button
            variant="favorite"
            isFavorite={fav}
            onClick={() => toggleFavorite(movie)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FavoriteIcon isFavorite={fav} />
          </Button>
        </div>
      </div>
    </m.div>
  );
}
