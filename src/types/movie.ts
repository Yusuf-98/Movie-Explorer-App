export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  credits: Credits;
  videos: VideoResponse;
  similar: MovieResponse;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  cast_id: number;
  credit_id: string;
  known_for_department: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}
// --- Movie Detail ---

export interface MovieDetailHeroProps {
  movie: MovieDetails;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onWatchTrailer: () => void;
}

export interface TrailerModalProps {
  videos: Video[];
  visible: boolean;
  onClose: () => void;
  movieTitle: string;
}

export interface MovieStatsProps {
  movie: MovieDetails;
  icon?: string;
  className?: string;
}

export interface MovieOverviewProps {
  movie: MovieDetails;
}

export interface CastSectionProps {
  cast: Cast[];
}

export interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export interface FavoriteItemProps {
  movie: Movie;
  index: number;
  isFavorite: boolean;
  onRemove: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export interface SearchResultItemProps {
  movie: Movie;
  index: number;
  onWatchTrailer: (movie: Movie) => void;
}

// --- Movie Card ---

export interface MovieCardProps {
  movie: Movie;
  index?: number;
  showRank?: boolean;
  rank?: number;
}

// --- Movie Grid ---

export interface MovieGridProps {
  movies?: Movie[];
  isLoading: boolean;
  title?: string;
  skeletonCount?: number;
}

// --- UI Components ---

// --- Button ---

export type ButtonType = 'primary' | 'secondary';
export type ButtonSize = 'large' | 'small';

export interface ButtonProps {
  label?: string;
  variant?: string;
  type: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  image?: React.ReactNode;
}

export interface LogoProps {
  className?: string;
  onClick?: () => void;
}
