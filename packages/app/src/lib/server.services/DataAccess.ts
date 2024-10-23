import type { Movie } from '$lib/isomorphic.types/Movie';
import fs from 'fs';
import { find, map } from 'lodash-es';
import path from 'path';

export class DataAccess {
  private movies: Movie[] = [];

  public constructor(private readonly dirPath: string) {}

  public getIndex() {
    const allMovies = this.getAllMovies();
    return map(allMovies, ({ imdbId, title, posterFileName }) => ({ id: imdbId, title, posterFileName }));
  }

  public getView(id: string) {
    const allMovies = this.getAllMovies();
    const movie = find(allMovies, (m) => m.imdbId === id);
    return { title: movie!.title, subtitles: movie!.subtitles[0].lines };
  }

  private getAllMovies() {
    if (this.movies.length !== 0) return this.movies;

    const movies: Movie[] = [];

    const files = fs.readdirSync(this.dirPath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (path.extname(file) === '.json') {
        movies.push(JSON.parse(fs.readFileSync(path.join(this.dirPath, file), 'utf-8')));
      }
    }

    this.movies = movies;
    return movies;
  }
}
