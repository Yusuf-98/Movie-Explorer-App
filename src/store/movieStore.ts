import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/types/movie';

interface MovieStore {
  favorites: Movie[];

  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movieId: number) => boolean;
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (movie) =>
        set((state) => {
          if (state.favorites.some((m) => m.id === movie.id)) return state;
          return { favorites: [...state.favorites, movie] };
        }),

      removeFromFavorites: (movieId) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== movieId),
        })),

      toggleFavorite: (movie) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(movie.id)) {
          removeFromFavorites(movie.id);
        } else {
          addToFavorites(movie);
        }
      },

      isFavorite: (movieId) => get().favorites.some((m) => m.id === movieId),
    }),
    {
      name: 'movie-store',
      skipHydration: true,
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
