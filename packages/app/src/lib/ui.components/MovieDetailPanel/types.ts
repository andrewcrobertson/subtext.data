export interface Movie {
  imdbId: string;
  title: string;
  releaseDate: string;
  posterUrl: string;
  rated: string;
  genres: string[];
  actors: string[];
  runTime: number;
  plot: string;
  isOnMyList: boolean;
}

export interface MyListEventDetail {
  id: string;
}
