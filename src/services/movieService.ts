import api from '@/lib/axios';
import type { MovieResponse, MovieDetails } from '@/types/movie';

export const movieService = {
  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const { data } = await api.get<MovieResponse>('/movie/now_playing', { params: { page } });
    return data;
  },

  getTrendingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const { data } = await api.get<MovieResponse>('/trending/movie/week', { params: { page } });
    return data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const { data } = await api.get<MovieDetails>(`/movie/${movieId}`, {
      params: { append_to_response: 'credits,videos,similar' },
    });
    return data;
  },

  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    const { data } = await api.get<MovieResponse>('/search/movie', {
      params: { query, page },
    });
    return data;
  },
};
