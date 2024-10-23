import { get } from 'lodash';
import type { SearchResult } from '../../types/Imdb';

export class OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async getInfo(imdbId: string) {
    const fetchMetaRes = await this.fetchMeta(imdbId);

    const data = {
      title: fetchMetaRes.Title,
      poster: fetchMetaRes.Poster,
      releaseDate: fetchMetaRes.Released,
      year: <any>fetchMetaRes.Year,
    };

    return data;
  }

  private async fetchMeta(imdbId: string) {
    try {
      const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Omdb Error: api fetch returned ${response.status}`);

      const data = (await response.json()) as SearchResult;
      return data;
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Omdb Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      throw new Error(message, { cause });
    }
  }
}
