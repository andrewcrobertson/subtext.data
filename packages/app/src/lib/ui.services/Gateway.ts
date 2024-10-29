import { includes } from 'lodash-es';
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
    const output: T.GetRecentMoviesOutput[] = [];
    const imdbIds = await this.queryAllMovies(this.showNRecentMovies);
    for (let i = 0; i < imdbIds.length; i++) {
      const imdbId = imdbIds[i];
      const movie = await this.getMovie(imdbId);
      if (movie !== null) output.push(movie);
    }

    return output;
  }

  public async searchMovies(query: string): Promise<T.SearchMoviesOutput[]> {
    const output: T.SearchMoviesOutput[] = [];
    const allMovies: T.SearchMoviesOutput[] = [];
    const imdbIds = await this.queryAllMovies(this.searchNRecentMovies);
    for (let i = 0; i < imdbIds.length; i++) {
      const imdbId = imdbIds[i];
      const movie = await this.getMovie(imdbId);
      if (movie !== null) allMovies.push(movie);
    }

    for (let i = 0; i < allMovies.length; i++) {
      const { title } = allMovies[i];
      const match = title.toLowerCase().includes(query.toLowerCase());
      if (match) output.push(allMovies[i]);
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

  public async queryAllMovies(maxMovies: number): Promise<string[]> {
    const output: string[] = [];

    let idx = 1;
    while (true) {
      const page = await this.api.getReleaseDateAsc(idx);
      if (page === null) break;
      for (let i = 0; i < page.imdbIds.length; i++) {
        const imdbId = page.imdbIds[i];
        output.push(imdbId);
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
