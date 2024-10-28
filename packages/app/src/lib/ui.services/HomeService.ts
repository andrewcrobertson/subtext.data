import type { MyListMovieIdManager } from '$lib/ui.services/MyListMovieIdManager';
import { includes } from 'lodash-es';
import type { Api } from './Api';
import type * as T from './HomeService.types';

export class HomeService {
  public constructor(
    private readonly api: Api,
    private readonly myListMovieIdManager: MyListMovieIdManager
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const index = await this.api.getIndex();
    const myListMovieIds = await this.myListMovieIdManager.get();
    const myListMovies: T.LoadOutputRecentMovie[] = [];

    for (let i = 0; i < index.length; i++) {
      const imdbId = index[i].imdbId;
      const movie = await this.api.getMovieData(imdbId);
      const isOnMyList = includes(myListMovieIds, movie!.imdbId);
      if (isOnMyList) myListMovies.push({ ...movie!, isOnMyList });
    }

    return { myListMovies };
  }

  public async removeFromMyList(imdbId: string): Promise<void> {
    await this.myListMovieIdManager.remove(imdbId);
  }
}
