export interface LoadOutputCurrentMovie {
  imdbId: string;
  title: string;
  releaseDate: string;
  posterUrl: string;
  rated: string;
  genres: string[];
  actors: string[];
  runTime: number;
  plot: string;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface LoadOutputRecentMovie {
  imdbId: string;
  title: string;
  releaseDate: string;
  posterUrl: string;
  rated: string;
  genres: string[];
  actors: string[];
  runTime: number;
  plot: string;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface LoadOutput {
  currentMovies: LoadOutputCurrentMovie[];
  recentMovies: LoadOutputRecentMovie[];
}

export interface SearchOutput {
  imdbId: string;
  title: string;
  releaseDate: string;
  posterUrl: string;
  rated: string;
  genres: string[];
  actors: string[];
  runTime: number;
  plot: string;
  subtitleCount: number;
  isOnMyList: boolean;
}