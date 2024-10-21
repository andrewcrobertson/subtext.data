import AdmZip from 'adm-zip';
import { endsWith } from 'lodash';
import path from 'path';
import type { SearchResult, Subtitle } from '../../types/Subdl';
import { parseSrt, SubtitleBlock } from '../utils/parseSrt';

const zipUrl = `https://dl.subdl.com`;
const apiUrl = `https://api.subdl.com/api/v1/subtitles`;

export class SubdlManager {
  public constructor(
    private readonly apiKey: string,
    private readonly stagingDir: string
  ) {}

  public async getInfo(imdbId: string) {
    const options: any[] = [];
    const subdlInfo = await this.fetchSubdlInfo(imdbId);

    if (subdlInfo.status) {
      for (let i = 0; i < subdlInfo.subtitles.length; i++) {
        const subtitle = subdlInfo.subtitles[i];
        try {
          const subtitleInfo = await this.getSubtitleInfo(subtitle);
          options.push(...subtitleInfo);
        } catch (err) {
          console.log(err);
        }
      }

      return { imdbId, title: subdlInfo.results[0].name, releaseDate: subdlInfo.results[0].release_date, year: subdlInfo.results[0].year, options };
    } else {
      return { imdbId, title: null, releaseDate: null, year: null, options: [] };
    }
  }

  private async fetchSubdlInfo(imdbId: string) {
    const response = await fetch(`${apiUrl}?api_key=${this.apiKey}&imdb_id=${imdbId}&type=movie&languages=EN`);
    const json: SearchResult = await response.json();
    return json;
  }

  private async getSubtitleInfo(subtitle: Subtitle) {
    const subtitles: { author: string; zipFile: string; srtFile: string; subtitles: SubtitleBlock[] }[] = [];

    const url = `${zipUrl}${subtitle.url}`;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const zip = new AdmZip(Buffer.from(arrayBuffer));
    const zipEntries = zip.getEntries();
    zipEntries.forEach((entry) => {
      if (!entry.isDirectory && endsWith(entry.entryName, '.srt')) {
        const content = entry.getData().toString();
        subtitles.push({ author: subtitle.author, zipFile: path.basename(url), srtFile: entry.entryName, subtitles: parseSrt(content) });
      }
    });

    return subtitles;
  }
}
