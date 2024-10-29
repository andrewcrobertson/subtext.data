import type { MyListMovieIdManager } from '$lib/ui.services/MyListMovieIdManager';
import type { Api } from './Api.types';
import type * as T from './HomeService.types';

export class HomeService {
  public constructor(
    private readonly api: Api,
    private readonly myListMovieIdManager: MyListMovieIdManager
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const myListMovieIds = await this.myListMovieIdManager.get();
    const myListMovies: T.LoadOutputRecentMovie[] = [];

    for (let i = 0; i < myListMovieIds.length; i++) {
      const imdbId = myListMovieIds[i];
      const movie = await this.api.getMovieData(imdbId);
      myListMovies.push({ ...movie!, isOnMyList: true });
    }

    return { myListMovies };
  }

  public async removeFromMyList(imdbId: string): Promise<void> {
    await this.myListMovieIdManager.remove(imdbId);
  }
}
