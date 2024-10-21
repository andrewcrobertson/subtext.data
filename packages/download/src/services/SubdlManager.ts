import AdmZip from 'adm-zip';
import { endsWith, get, toPairs } from 'lodash';
import path from 'path';
import type { SearchResult, Subtitle } from '../../types/Subdl';
import { parseSrt, SubtitleBlock } from '../utils/parseSrt';

const errOutput = { success: false, data: null };

export interface Info {
  success: boolean;
  data: {
    imdbId: string;
    title: string | null;
    releaseDate: string | null;
    year: number | null;
    options: any[];
  };
  errors: Error[];
}

export class SubdlManager {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly subdlZipUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async getInfo(imdbId: string) {
    const output: Info = { success: false, data: { imdbId, title: null, releaseDate: null, year: null, options: [] }, errors: [] };

    const fetchMetaRes = await this.fetchMeta(imdbId);
    if (!fetchMetaRes.success) return { ...errOutput, errors: fetchMetaRes.errors };

    for (let i = 0; i < fetchMetaRes.data!.subtitles.length; i++) {
      const subtitle = fetchMetaRes.data!.subtitles[i];
      const fetchZipRes = await this.fetchZip(subtitle);

      if (!fetchZipRes.success) {
        output.errors.push(...fetchZipRes.errors);
        continue;
      }

      const extractZipRes = await this.extractZip(fetchZipRes.data!);
      if (!extractZipRes.success) {
        output.errors.push(...extractZipRes.errors);
        continue;
      }

      const author = subtitle.author;
      const zipFile = path.basename(subtitle.url);
      const srtFilePairs = toPairs(extractZipRes.data!);
      for (let i = 0; i < srtFilePairs.length; i++) {
        const [srtFile, subtitles] = srtFilePairs[i];
        output.data.options.push({ author, zipFile, srtFile, subtitles });
      }
    }

    output.data.title = fetchMetaRes.data!.results[0].name;
    output.data.releaseDate = fetchMetaRes.data!.results[0].release_date;
    output.data.year = fetchMetaRes.data!.results[0].year;
    output.success = true;

    return output;
  }

  private async fetchMeta(imdbId: string) {
    try {
      const response = await fetch(`${this.apiUrlBase}?api_key=${this.apiKey}&imdb_id=${imdbId}&type=movie&languages=EN`);
      if (!response.ok) return { ...errOutput, errors: [new Error(`Subdl Error: api fetch returned ${response.status}`)] };

      const data = (await response.json()) as SearchResult;
      if (!data.status) return { ...errOutput, errors: [new Error(`Subdl Error: api fetch returned a status of 'false'`)] };

      return { success: true, data, errors: [] };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { ...errOutput, errors: [new Error(message, { cause })] };
    }
  }

  private async fetchZip(subtitle: Subtitle) {
    try {
      const url = `${this.subdlZipUrlBase}${subtitle.url}`;
      const response = await fetch(url);
      if (!response.ok) return { ...errOutput, errors: [new Error(`Subdl Error: zip fetch returned ${response.status}`)] };

      const data = await response.arrayBuffer();
      return { success: true, data, errors: [] };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: zip fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { ...errOutput, errors: [new Error(message, { cause })] };
    }
  }

  private async extractZip(arrayBuffer: ArrayBuffer) {
    const data: Record<string, SubtitleBlock[]> = {};
    try {
      const zip = new AdmZip(Buffer.from(arrayBuffer));
      const entries = zip.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.isDirectory && endsWith(entry.entryName, '.srt')) {
          data[entry.entryName] = parseSrt(entry.getData().toString());
        }
      }

      return { success: true, data, errors: [] };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: extract zip unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { ...errOutput, errors: [new Error(message, { cause })] };
    }
  }
}
