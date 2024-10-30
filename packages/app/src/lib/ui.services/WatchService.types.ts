export interface LoadOutputMovie {
  imdbId: string;
  title: string;
  runTime: number | null;
  subtitles: LoadOutputMovieSubtitleBlock[];
}

export interface LoadOutputMovieSubtitleBlock {
  start: number;
  end: number;
  text: string;
}

export interface LoadOutput {
  movie: LoadOutputMovie;
}
