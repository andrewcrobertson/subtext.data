import type { Movie } from '$lib/isomorphic.types/Movie';
import fs from 'fs';
import { find, map } from 'lodash-es';
import path from 'path';

export class DataAccess {
  public constructor(private readonly dirPath: string) {}

  public getIndex() {
    const allMovies = this.getAllMovies();
    return map(allMovies, ({ imdbId, title, poster }) => ({ id: imdbId, title, poster }));
  }

  public getView(id: string) {
    const allMovies = this.getAllMovies();
    const movie = find(allMovies, (m) => m.imdbId === id);
    return { title: movie!.title, subtitles: movie!.options[0].subtitles };
  }

  private getAllMovies() {
    const movies: Movie[] = [];

    const files = fs.readdirSync(this.dirPath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (path.extname(file) === '.json') {
        movies.push(JSON.parse(fs.readFileSync(path.join(this.dirPath, file), 'utf-8')));
      }
    }

    return movies;
  }
}
