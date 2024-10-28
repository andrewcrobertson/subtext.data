import type { MyListManager } from '$lib/ui.services/MyListManager';
import { includes } from 'lodash-es';
import type { Api } from './Api';
import type * as T from './SearchService.types';

export class SearchService {
  public constructor(
    private readonly showNRecentMovies: number,
    private readonly api: Api,
    private readonly myListManager: MyListManager
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const index = await this.api.getIndex();
    const myListMovieIds = this.myListManager.get();
    const currentMovies: T.LoadOutputCurrentMovie[] = [];
    const recentMovies: T.LoadOutputRecentMovie[] = [];

    let gotNRecentMovies = false;
    for (let i = 0; i < index.length; i++) {
      const movie = index[i];
      gotNRecentMovies = recentMovies.length > this.showNRecentMovies;
      if (includes(myListMovieIds, movie.imdbId)) {
        currentMovies.push({ ...movie, isOnMyList: true });
      } else {
        if (!gotNRecentMovies) recentMovies.push({ ...movie, isOnMyList: true });
      }

      if (gotNRecentMovies && currentMovies.length === myListMovieIds.length) break;
    }

    return { currentMovies, recentMovies };
  }
}
