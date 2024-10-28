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

export interface GetIndexOutput extends Omit<ApiGetIndexOutput, 'posterFileName'> {
  posterUrl: string;
}

export interface GetMovieDataOutput extends Omit<ApiGetMovieDataOutput, 'posterFileName' | 'subtitleIds'> {
  posterUrl: string;
  subtitleCount: number;
}
