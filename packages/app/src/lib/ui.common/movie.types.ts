export interface Movie {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  posterFileName: string;
  rated: string;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number;
  plot: string;
  subtitles: Subtitle[];
}

export interface Subtitle {
  subtitleId: string;
  source: string;
  author: string;
  zipFileName: string;,
  subtitleFileName: string;
  subtextFileName: string;
}
