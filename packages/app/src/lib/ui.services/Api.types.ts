export interface ApiGetIndexOutput {
  imdbId: string;
  title: string;
  posterFileName: string | null;
  subtitleCount: number;
}

export interface GetIndexOutput {
  imdbId: string;
  title: string;
  posterUrl: string;
  subtitleCount: number;
}
