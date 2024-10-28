import type { MyListManager } from '$lib/ui.services/MyListManager';
import { filter, includes } from 'lodash-es';
import type { Api } from './Api';

export class Gateway {
  public constructor(
    private readonly api: Api,
    private readonly myListManager: MyListManager
  ) {}

  public async getMyList() {
    const index = await this.api.getIndex();
    const myListMovieIds = this.myListManager.get();
    const myListMovies = filter(index, (m) => includes(myListMovieIds, m.imdbId));
    return myListMovies;
  }
}
