import { get } from 'lodash';
import type { SearchResult } from '../../types/Imdb';

const errOutput = { success: false, data: null };

export interface Info {
  success: boolean;
  data: {
    imdbId: string;
    title: string | null;
    poster: string | null;
    releaseDate: string | null;
    year: number | null;
    options: any[];
  };
  errors: Error[];
}

export class OmdbManager {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async getInfo(imdbId: string) {
    const output: Info = { success: false, data: { imdbId, title: null, poster: null, releaseDate: null, year: null, options: [] }, errors: [] };

    const fetchMetaRes = await this.fetchMeta(imdbId);
    if (!fetchMetaRes.success) return { ...errOutput, errors: fetchMetaRes.errors };

    output.data.title = fetchMetaRes.data!.Title;
    output.data.poster = fetchMetaRes.data!.Poster;
    output.data.releaseDate = fetchMetaRes.data!.Released;
    output.data.year = <any>fetchMetaRes.data!.Year;
    output.success = true;

    return output;
  }

  private async fetchMeta(imdbId: string) {
    try {
      const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      if (!response.ok) return { ...errOutput, errors: [new Error(`Omdb Error: api fetch returned ${response.status}`)] };

      const data = (await response.json()) as SearchResult;

      return { success: true, data, errors: [] };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Omdb Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { ...errOutput, errors: [new Error(message, { cause })] };
    }
  }
}
