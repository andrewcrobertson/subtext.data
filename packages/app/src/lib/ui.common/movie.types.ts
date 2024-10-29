export interface Movie {
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
  subtitleIds: Subtitle[];
}

export interface Subtitle {
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
}
