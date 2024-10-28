import { map } from 'lodash-es';
import type * as T from './Api.types';

export class Api {
  public constructor(private readonly baseUrl: string) {}

  public async getIndex(): Promise<T.GetIndexOutput[]> {
    const url = `${this.baseUrl}/index.json`;
    const res = await fetch(url);
    const dataRaw: T.ApiGetIndexOutput[] = await res.json();
    const data = map(dataRaw, (m) => this.mapIndex(m));
    return data;
  }

  private mapIndex(movie: T.ApiGetIndexOutput) {
    const { posterFileName, ...rest } = movie;
    const posterUrl = `${this.baseUrl}/${rest.imdbId}/${posterFileName}`!;
    const output = { ...rest, posterUrl };
    return output;
  }
}
