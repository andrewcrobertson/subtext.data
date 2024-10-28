import type { MyListMovieIdManager } from '$lib/ui.services/MyListMovieIdManager';
import { filter, includes } from 'lodash-es';
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
    const myListMovies = filter(index, (m) => includes(myListMovieIds, m.imdbId));
    return { myListMovies };
  }
}
