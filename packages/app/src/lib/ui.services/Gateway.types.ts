export interface GetRecentMoviesOutput {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface SearchMoviesOutput {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface GetMyListMoviesOutput {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface GetMovieOutput {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface Gateway {
  getRecentMovies: () => Promise<GetRecentMoviesOutput[]>;
  searchMovies: () => Promise<SearchMoviesOutput[]>;
  getMovie: (imdbId: string) => Promise<GetMovieOutput | null>;
  getMyListMovies: (userId: string) => Promise<GetMyListMoviesOutput[]>;
  removeFromMyList: (userId: string, imdbId: string) => Promise<void>;
}
