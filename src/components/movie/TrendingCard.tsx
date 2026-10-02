import { useEffect, useState } from 'react';
import { useCarousel } from '../ui/carousel.context';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import type { Movie } from '@/types/movie';

const EAGER_COUNT = 3;

interface TrendingCardProps {
  movie: Movie;
  index: number;
  rank: number;
}

export function TrendingCard({ movie, index, rank }: TrendingCardProps) {
  const { api } = useCarousel();
  const [isRevealed, setIsRevealed] = useState(index < EAGER_COUNT);

  useEffect(() => {
    if (isRevealed || !api) return;

    const checkInView = () => {
      if (api.slidesInView().includes(index)) setIsRevealed(true);
    };
    checkInView();
    api.on('select', checkInView);
    api.on('scroll', checkInView);

    return () => {
      api.off('select', checkInView);
      api.off('scroll', checkInView);
    };
  }, [api, index, isRevealed]);

  return isRevealed ? (
    <MovieCard movie={movie} index={index} showRank rank={rank} />
  ) : (
    <MovieCardSkeleton />
  );
}
