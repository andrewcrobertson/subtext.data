export interface LoadOutputMyListMovie {
  imdbId: string;
  title: string;
  posterUrl: string;
  subtitleCount: number;
}

export interface LoadOutput {
  myListMovies: LoadOutputMyListMovie[];
}
