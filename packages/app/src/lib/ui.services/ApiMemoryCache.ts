import type * as T from './Api.types';

export class ApiMemoryCache implements T.Api {
  private index: T.GetIndexOutput[] = [];

  public constructor(private readonly instance: T.Api) {}

  public async getIndex(): Promise<T.GetIndexOutput[]> {
    if (this.index.length === 0) {
      this.index = await this.instance.getIndex();
    }

    return this.index;
  }

  public async getMovieData(imdbId: string): Promise<T.GetMovieOutput | null> {
    return await this.instance.getMovieData(imdbId);
  }
}
