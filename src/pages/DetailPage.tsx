import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailSkeleton } from '@/components/movie/DetailSkeleton';
import { useMovieDetails } from '@/hooks/useMovies';
import { useMovieStore } from '@/store/movieStore';
import { DetailError } from '@/components/movie/ErrorState';
import { ApiError } from '@/lib/axios';
import { MovieDetailHero } from '@/components/movie/MovieDetailHero';
import { MovieOverview } from '@/components/movie/MovieOverview';
import { CastSection } from '@/components/movie/CastSection';
import { SimilarMoviesSection } from '@/components/movie/SimilarMoviesSection';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { Toast } from '@/components/ui/Toast';

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { data: movie, isLoading, isError, error, refetch } = useMovieDetails(movieId);
  const { isFavorite, toggleFavorite } = useMovieStore();

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const handleToggleFavorite = useCallback(() => {
    if (!movie) return;

    const movieBase = {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      genre_ids: movie.genres?.map((g) => g.id) ?? [],
      adult: movie.adult,
    };

    const wasFav = isFavorite(movie.id);
    toggleFavorite(movieBase);

    setToast({
      visible: true,
      message: wasFav ? 'Removed from Favorites' : 'Success Add to Favorites',
    });
  }, [movie, isFavorite, toggleFavorite]);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !movie) {
    const notFound = !isError || (error instanceof ApiError && error.status === 404);
    return (
      <DetailError notFound={notFound} onBack={() => navigate('/')} onRetry={() => refetch()} />
    );
  }

  const videos = movie.videos?.results ?? [];
  const cast = movie.credits?.cast ?? [];
  const similarMovies = movie.similar?.results ?? [];
  const favStatus = isFavorite(movie.id);

  return (
    <div className="custom-container bg-base-black">
      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} />

      {/* Hero */}
      <MovieDetailHero
        movie={movie}
        isFavorite={favStatus}
        onToggleFavorite={handleToggleFavorite}
        onWatchTrailer={() => setTrailerOpen(true)}
      />

      {/* Overview */}
      <MovieOverview movie={movie} />

      {/* Cast & Crew */}
      <CastSection cast={cast} />

      {/* Similar Movies */}
      <SimilarMoviesSection movies={similarMovies} />

      {/* Trailer Modal */}
      <TrailerModal
        videos={videos}
        visible={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        movieTitle={movie.title}
      />
    </div>
  );
}
