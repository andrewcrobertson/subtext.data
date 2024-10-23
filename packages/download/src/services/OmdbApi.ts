import { endsWith, get, parseInt, split } from 'lodash';
import type { SearchResult } from '../../types/Imdb';

export class OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string) {
    const fetchSearchRes = await this.fetchSearch(imdbId);

    const output = {
      title: fetchSearchRes.Title,
      poster: fetchSearchRes.Poster,
      releaseDate: this.parseReleaseDate(fetchSearchRes.Released),
      releaseYear: this.parseReleaseYear(fetchSearchRes.Year),
      rated: fetchSearchRes.Rated,
      genres: split(fetchSearchRes.Genre, ' '),
      actors: split(fetchSearchRes.Actors, ' '),
      runTime: this.parseRunTime(fetchSearchRes.Runtime),
      plot: fetchSearchRes.Plot,
    };

    return output;
  }

  private async fetchSearch(imdbId: string) {
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

  private parseReleaseDate(date: string) {
    try {
      return new Date(Date.parse(`${date} UTC`));
    } catch (err) {
      console.error(`Could not parse release date: '${date}'`, err);
      return null;
    }
  }

  private parseReleaseYear(year: string) {
    try {
      return parseInt(year, 10);
    } catch (err) {
      console.error(`Could not parse release year: '${year}'`, err);
      return null;
    }
  }

  private parseRunTime(runTime: string) {
    try {
      if (!endsWith(runTime, 'min')) throw new Error(`Invalid run time: ${runTime}`);
      return parseInt(runTime, 10);
    } catch (err) {
      console.error(`Could not parse release year: '${runTime}'`, err);
      return null;
    }
  }
}
