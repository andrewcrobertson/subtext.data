export interface Option {
  author: string;
  zipFile: string;
  srtFile: string;
  subtitles: any[];
}

export interface Movie {
  imdbId: string;
  title: string;
  releaseDate: string;
  year: number;
  poster: string;
  options: Option[];
}
