import type { MyListMovieIdManager } from '$lib/ui.services/MyListMovieIdManager';
import { includes } from 'lodash-es';
import type { Gateway } from './Gateway.types';
import type * as T from './SearchService.types';

export class SearchService {
  public constructor(
    private readonly showNRecentMovies: number,
    private readonly gateway: Gateway,
    private readonly myListMovieIdManager: MyListMovieIdManager
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const recentMoviesRaw = await this.gateway.getRecentMovies();
    const myListMovieIds = await this.myListMovieIdManager.get();
    const recentMovies: T.LoadOutputRecentMovie[] = [];

    let gotNRecentMovies = false;
    for (let i = 0; i < recentMoviesRaw.length; i++) {
      const recentMovie = recentMoviesRaw[i];
      const isOnMyList = includes(myListMovieIds, recentMovie.imdbId);
      gotNRecentMovies = recentMovies.length > this.showNRecentMovies;
      if (!gotNRecentMovies) recentMovies.push({ ...recentMovie, isOnMyList });
      if (gotNRecentMovies) break;
    }

    return { recentMovies };
  }

  public async search(query: string): Promise<T.SearchOutput[]> {
    if (query === '') return [];

    const recentMovies = await this.gateway.getRecentMovies();
    const myListMovieIds = await this.myListMovieIdManager.get();
    const matchingMovies: T.SearchOutput[] = [];

    for (let i = 0; i < recentMovies.length; i++) {
      const { imdbId, title } = recentMovies[i];
      const match = title.toLowerCase().includes(query.toLowerCase());
      if (match) {
        const movie = await this.gateway.getMovie(imdbId);
        const isOnMyList = includes(myListMovieIds, movie!.imdbId);
        matchingMovies.push({ ...movie!, isOnMyList });
      }
    }

    return matchingMovies;
  }

  public async updateIsOnMyList(imdbId: string, isOnMyList: boolean): Promise<void> {
    if (isOnMyList) {
      await this.myListMovieIdManager.add(imdbId);
    } else {
      await this.myListMovieIdManager.remove(imdbId);
    }
  }
}
