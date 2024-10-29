import { includes } from 'lodash-es';
import type { Api } from './Api.types';
import type * as T from './Gateway.types';
import type { MyListMovieIdManager } from './MyListMovieIdManager';

export class Gateway implements T.Gateway {
  public constructor(
    private readonly maxNRecentMovies: number,
    private readonly baseUrl: string,
    private readonly api: Api,
    private readonly myListMovieIdManager: MyListMovieIdManager
  ) {}

  public async getRecentMovies(): Promise<T.GetRecentMoviesOutput[]> {
    const output: T.GetRecentMoviesOutput[] = [];

    let idx = 1;
    while (true) {
      const index = await this.api.getIndex(idx);
      if (index === null) break;
      for (let i = 0; i < index.imdbIds.length; i++) {
        const imdbId = index.imdbIds[i];
        const movie = await this.doGetMovie(imdbId);
        if (movie !== null) output.push(movie);
        if (output.length >= this.maxNRecentMovies) break;
      }

      idx++;
    }

    return output;
  }

  public async searchMovies(query: string): Promise<T.SearchMoviesOutput[]> {
    const output: T.SearchMoviesOutput[] = [];

    let idx = 1;
    while (true) {
      const index = await this.api.getIndex(idx);
      if (index === null) break;
      for (let i = 0; i < index.imdbIds.length; i++) {
        const imdbId = index.imdbIds[i];
        const movie = await this.doGetMovie(imdbId);
        if (movie !== null) output.push(movie);
        if (output.length >= this.maxNRecentMovies) break;
      }

      idx++;
    }

    return output;
  }

  public async getMyListMovies(userId: string): Promise<T.GetMyListMoviesOutput[]> {
    const myListMovieIds = await this.myListMovieIdManager.get();

    const output: T.GetMyListMoviesOutput[] = [];
    for (let i = 0; i < myListMovieIds.length; i++) {
      const imdbId = myListMovieIds[i];
      const movie = await this.doGetMovie(imdbId);
      if (movie !== null) output.push(movie);
    }

    return output;
  }

  public async removeFromMyList(userId: string, imdbId: string): Promise<void> {
    await this.myListMovieIdManager.remove(imdbId);
  }

  public async getMovie(imdbId: string): Promise<T.GetMovieOutput | null> {
    const movie = await this.doGetMovie(imdbId);
    return movie === null ? null : movie;
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
    const posterUrl = `${this.baseUrl}/${imdbId}/${posterFileName}`;
    return posterUrl;
  }
}
