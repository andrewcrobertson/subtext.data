import type { MyListMovieIdManager } from '$lib/ui.services/MyListMovieIdManager';
import { includes } from 'lodash-es';
import type { Api } from './Api';
import type * as T from './SearchService.types';

export class SearchService {
  public constructor(
    private readonly showNRecentMovies: number,
    private readonly api: Api,
    private readonly myListMovieIdManager: MyListMovieIdManager
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const index = await this.api.getIndex();
    const myListMovieIds = await this.myListMovieIdManager.get();
    const currentMovies: T.LoadOutputCurrentMovie[] = [];
    const recentMovies: T.LoadOutputRecentMovie[] = [];

    console.log(myListMovieIds);
    let gotNRecentMovies = false;
    for (let i = 0; i < index.length; i++) {
      const imdbId = index[i].imdbId;
      const movie = await this.api.getMovieData(imdbId);
      gotNRecentMovies = recentMovies.length > this.showNRecentMovies;
      if (includes(myListMovieIds, movie!.imdbId)) {
        currentMovies.push({ ...movie!, isOnMyList: true });
      } else {
        if (!gotNRecentMovies) recentMovies.push({ ...movie!, isOnMyList: false });
      }

      if (gotNRecentMovies && currentMovies.length === myListMovieIds.length) break;
    }

    return { currentMovies, recentMovies };
  }

  public async search(query: string): Promise<T.SearchOutput[]> {
    if (query === '') return [];

    const index = await this.api.getIndex();
    const myListMovieIds = await this.myListMovieIdManager.get();
    const matchingMovies: T.SearchOutput[] = [];

    for (let i = 0; i < index.length; i++) {
      const { imdbId, title } = index[i];
      const match = title.toLowerCase().includes(query.toLowerCase());
      if (match) {
        const movie = await this.api.getMovieData(imdbId);
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
