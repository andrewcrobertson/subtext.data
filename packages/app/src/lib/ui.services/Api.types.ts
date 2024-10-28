export interface ApiGetIndexOutput {
  imdbId: string;
  title: string;
  posterFileName: string | null;
  subtitleCount: number;
}

export interface ApiGetMovieDataOutput {
  imdbId: string;
  title: string;
  releaseDate: string;
  releaseYear: number;
  posterFileName: string;
  rated: string;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number;
  plot: string;
  subtitleIds: string[];
  isAvailable: boolean;
}

export interface GetIndexOutput {
  imdbId: string;
  title: string;
  posterUrl: string;
  subtitleCount: number;
}

export interface GetMovieDataOutput {
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
  isAvailable: boolean;
}
