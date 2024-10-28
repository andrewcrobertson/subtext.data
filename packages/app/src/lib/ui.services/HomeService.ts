import type { MyListManager } from '$lib/ui.services/MyListManager';
import { filter, includes } from 'lodash-es';
import type { Api } from './Api';
import type * as T from './HomeService.types';

export class HomeService {
  public constructor(
    private readonly api: Api,
    private readonly myListManager: MyListManager
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const index = await this.api.getIndex();
    const myListMovieIds = this.myListManager.get();
    const myListMovies = filter(index, (m) => includes(myListMovieIds, m.imdbId));
    return { myListMovies };
  }
}
