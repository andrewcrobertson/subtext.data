import { find, map } from 'lodash-es';
import type * as T from './Api.types';

export class ApiFetch implements T.Api {
  public constructor(private readonly baseUrl: string) {}

  public async getIndex(): Promise<T.GetIndexOutput[]> {
    const data = await this.doGetIndex();
    return data;
  }

  public async getMovieData(imdbId: string): Promise<T.GetMovieDataOutput | null> {
    const data = await this.doGetIndex();
    const movie = find(data, (m) => m.imdbId === imdbId) ?? null;

    if (movie === null) return null;
    const movieData = await this.doGetMovieData(imdbId);
    if (movieData === null) return null;

    const { subtitleIds, posterFileName, ...rest } = movieData;
    const posterUrl = this.getPosterUrl(rest.imdbId, posterFileName!);
    return { ...rest, posterUrl, subtitleCount: movieData.subtitleIds.length };
  }

  private async doGetIndex() {
    const url = `${this.baseUrl}/index.json`;
    const res = await fetch(url);
    const dataRaw: T.ApiGetIndexOutput[] = await res.json();
    const data = map(dataRaw, (m) => this.mapIndex(m));
    return data;
  }

  private async doGetMovieData(imdbId: string) {
    const url = `${this.baseUrl}/${imdbId}/index.json`;
    const res = await fetch(url);
    const data: T.ApiGetMovieDataOutput = await res.json();
    return data;
  }

  private mapIndex(movie: T.ApiGetIndexOutput) {
    const { posterFileName, ...rest } = movie;
    const posterUrl = this.getPosterUrl(rest.imdbId, posterFileName!);
    const output = { ...rest, posterUrl };
    return output;
  }

  private getPosterUrl(imdbId: string, posterFileName: string) {
    const posterUrl = `${this.baseUrl}/${imdbId}/${posterFileName}`;
    return posterUrl;
  }
}
