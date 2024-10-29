export interface GetIndexOutput {
  pageNumber: number;
  pageCount: number;
  imdbIds: string[];
}

export interface GetMovieOutput {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterFileName: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleIds: string[];
  isAvailable: boolean;
}

export interface GetSubtitleOutput {
  subtitleId: string;
  source: string;
  author: string;
  zipFileName: string | null;
  subtitleFileName: string;
  subtextFileName: string;
}

export interface Api {
  getIndex: (pageNumber: string) => Promise<GetIndexOutput | null>;
  getMovieData: (imdbId: string) => Promise<GetMovieOutput | null>;
  getSubtitle: (imdbId: string, subtitleId: string) => Promise<GetSubtitleOutput | null>;
}
