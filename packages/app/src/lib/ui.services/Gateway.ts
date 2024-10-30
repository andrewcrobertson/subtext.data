import { convertSubtitles } from '$lib/isomorphic.utils/convertSubtitles';
import { compact, filter, includes, lowerCase, map } from 'lodash-es';
import type { Api } from './Api.types';
import type * as T from './Gateway.types';
import type { MyListMovieIdManager } from './MyListMovieIdManager';

export class Gateway implements T.Gateway {
  public constructor(
    private readonly baseUrl: string,
    private readonly showNRecentMovies: number,
    private readonly searchNRecentMovies: number,
    private readonly api: Api,
    private readonly myListMovieIdManager: MyListMovieIdManager
  ) {}

  public async getRecentMovies(): Promise<T.GetRecentMoviesOutput[]> {
    const imdbIds = await this.queryAllMovies(this.showNRecentMovies);
    const movies = await Promise.all(map(imdbIds, (imdbId) => this.getMovie(imdbId)));
    const output: T.GetRecentMoviesOutput[] = compact(movies);
    return output;
  }

  public async searchMovies(query: string): Promise<T.SearchMoviesOutput[]> {
    const queryLower = lowerCase(query);
    const imdbIds = await this.queryAllMovies(this.searchNRecentMovies);
    const movies = await Promise.all(map(imdbIds, (imdbId) => this.getMovie(imdbId)));
    const moviesCompact = compact(movies);
    const output: T.SearchMoviesOutput[] = filter(moviesCompact, (m) => includes(m.title, queryLower));
    return output;
  }

  public async getMyListMovies(userId: string): Promise<T.GetMyListMoviesOutput[]> {
    const imdbIds = await this.myListMovieIdManager.get();
    const movies = await Promise.all(map(imdbIds, (imdbId) => this.getMovie(imdbId)));
    const output: T.GetMyListMoviesOutput[] = compact(movies);
    return output;
  }

  public async addToMyList(userId: string, imdbId: string): Promise<void> {
    await this.myListMovieIdManager.add(imdbId);
  }

  public async removeFromMyList(userId: string, imdbId: string): Promise<void> {
    await this.myListMovieIdManager.remove(imdbId);
  }

  public async getMovie(imdbId: string): Promise<T.GetMovieOutput | null> {
    const movie = await this.doGetMovie(imdbId);
    return movie === null ? null : movie;
  }

  public async getMovieWithSubtitles(imdbId: string): Promise<T.GetMovieWithSubtitlesOutput | null> {
    const movie = await this.api.getMovie(imdbId);
    if (movie === null || !movie.isAvailable || movie.subtitleIds.length === 0) return null;

    const subtitle = await this.api.getSubtitle(imdbId, movie.subtitleIds[0]);
    if (subtitle === null) return null;

    const subtitleFile = await this.api.getSubtitleFile(imdbId, subtitle.subtitleId, subtitle.subtextFileName);
    const subtitles = convertSubtitles(subtitleFile ?? '');
    const { title, runTime } = movie;
    return { imdbId, title, runTime, subtitles };
  }

  public async queryAllMovies(maxMovies: number): Promise<string[]> {
    const output: string[] = [];

    let idx = 1;
    while (true) {
      const page = await this.api.getReleaseDateAsc(idx);
      if (page === null) break;
      for (let i = 0; i < page.imdbIds.length; i++) {
        output.push(page.imdbIds[i]);
        if (output.length >= maxMovies) break;
      }

      idx++;
    }

    return output;
  }

  private async doGetMovie(imdbId: string): Promise<T.GetRecentMoviesOutput | T.GetMovieOutput | null> {
    const movie = await this.api.getMovie(imdbId);
    if (movie === null || !movie.isAvailable) return null;

    const { posterFileName, subtitleIds, isAvailable, ...rest } = movie;
    const posterUrl = this.getPosterUrl(imdbId, posterFileName);
    const subtitleCount = subtitleIds.length;

    const myListMovieIds = await this.myListMovieIdManager.get();
    const isOnMyList = includes(myListMovieIds, movie.imdbId);

    return { posterUrl, subtitleCount, isOnMyList, ...rest };
  }

  private getPosterUrl(imdbId: string, posterFileName: string | null) {
    if (posterFileName === null) return null;
    const posterUrl = `${this.baseUrl}/movies/${imdbId}/${posterFileName}`;
    return posterUrl;
  }
}
