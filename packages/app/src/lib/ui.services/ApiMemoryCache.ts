import type * as T from './Api.types';

export class ApiMemoryCache implements T.Api {
  private releaseDates: Record<number, T.GetReleaseDateAscOutput | null> = {};
  private movies: Record<string, T.GetMovieOutput | null> = {};
  private subtitles: Record<string, T.GetSubtitleOutput | null> = {};

  public constructor(private readonly instance: T.Api) {}

  public async getReleaseDateAsc(pageNumber: number): Promise<T.GetReleaseDateAscOutput | null> {
    if (this.releaseDates[pageNumber] === undefined) {
      this.releaseDates[pageNumber] = await this.instance.getReleaseDateAsc(pageNumber);
    }

    return this.releaseDates[pageNumber];
  }

  public async getMovie(imdbId: string): Promise<T.GetMovieOutput | null> {
    if (this.movies[imdbId] === undefined) {
      this.movies[imdbId] = await this.instance.getMovie(imdbId);
    }

    return this.movies[imdbId];
  }

  public async getSubtitle(imdbId: string, subtitleId: string): Promise<T.GetSubtitleOutput | null> {
    if (this.subtitles[subtitleId] === undefined) {
      this.subtitles[subtitleId] = await this.instance.getSubtitle(imdbId, subtitleId);
    }

    return this.subtitles[subtitleId];
  }
}
