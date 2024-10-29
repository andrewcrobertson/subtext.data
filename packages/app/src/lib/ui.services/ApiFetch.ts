import type * as T from './Api.types';

export class ApiFetch implements T.Api {
  public constructor(private readonly baseUrl: string) {}

  public async getIndex(pageNumber: string): Promise<T.GetIndexOutput | null> {
    const url = `${this.baseUrl}/movies/index.${pageNumber}.json`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data: T.GetIndexOutput = await res.json();
    return data;
  }

  public async getMovieData(imdbId: string): Promise<T.GetMovieOutput | null> {
    const url = `${this.baseUrl}/movies/${imdbId}/index.json`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data: T.GetMovieOutput = await res.json();
    return data;
  }

  public async getSubtitle(imdbId: string, subtitleId: string): Promise<T.GetSubtitleOutput | null> {
    const url = `${this.baseUrl}/movies/${imdbId}/subtitles/${subtitleId}/index.json`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data: T.GetSubtitleOutput = await res.json();
    return data;
  }
}
