import fs from 'fs';
import { concat, filter, flattenDeep, get, isError, join, map } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { GithubApi } from './GithubApi';
import type { Logger } from './Logger';
import type { OmdbApi } from './OmdbApi';
import { SubdlApi } from './SubdlApi';

export class Downloader {
  public constructor(
    private readonly gitHubApi: GithubApi,
    private readonly omdbApi: OmdbApi,
    private readonly subdlApi: SubdlApi,
    private readonly logger: Logger
  ) {}

  public async run(dataDir: string, posterDir: string) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(posterDir, { recursive: true });

    this.logger.infoStarting();
    const openIssues = await this.gitHubApi.getOpenIssues('add');

    this.logger.infoOpenGitHubIssuesFound(openIssues.length);
    for (let i = 0; i < openIssues.length; i++) {
      const issue = openIssues[i];
      await this.process(dataDir, posterDir, issue.gitHubIssueNumber, issue.imdbId);
    }

    this.logger.infoBlank();
  }

  private async process(dataDir: string, posterDir: string, gitHubIssueNumber: number, imdbId: string) {
    const gitHubComments: string[] = [];

    const omdbSearchRes = await this.omdbSearch(imdbId);
    const subdlSearchRes = await this.subdlSearch(imdbId);
    const errors = concat(omdbSearchRes.errors, subdlSearchRes.errors);
    const errorText = map(errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    const title = omdbSearchRes.data?.title ?? subdlSearchRes.data?.title ?? 'Unknown Title';

    this.logger.infoTitle(title);
    this.logger.infoProcessing(gitHubIssueNumber, imdbId);
    gitHubComments.push(`**${title}**`);

    if (omdbSearchRes.success) {
      this.logger.infoMovieMetadataFound();
      gitHubComments.push(`:heavy_check_mark: Metadata found`);
    } else {
      this.logger.infoMovieMetadataNotFound();
      gitHubComments.push(`:heavy_multiplication_x: Metadata not found`);
    }

    // if (subdlSearchRes.data.subtitles.length > 0) {
    if (subdlSearchRes.success) {
      this.logger.infoMovieSubtitlesFound();
      gitHubComments.push(`:heavy_check_mark: Subtitles found`);
    } else {
      this.logger.infoMovieSubtitlesNotFound();
      gitHubComments.push(`:heavy_multiplication_x: Subtitles not found`);
    }

    if (errorText.length > 0) {
      gitHubComments.push(``);
      gitHubComments.push(`**Errors**`);
      gitHubComments.push(join(errorText, '\n'));

      for (let i = 0; i < errorText.length; i++) {
        this.logger.errorMessage(errorText[i]);
      }
    }

    const poster = omdbSearchRes.data?.poster ?? null;
    if (poster !== null) {
      const ext = path.parse(path.basename(poster)).ext;
      const posterFile = path.resolve(posterDir, `${imdbId}${ext}`);
      const response = await fetch(poster);
      const fileStream = fs.createWriteStream(posterFile);
      await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
      this.logger.infoSavedPosterFile(posterFile);
    }

    const posterUrl = poster === null ? null : `posters/${imdbId}${path.parse(path.basename(poster)).ext}`;
    const dataFile = path.resolve(dataDir, `${imdbId}.json`);
    const movie = { ...subdlSearchRes.data, ...omdbSearchRes.data, poster: posterUrl };
    fs.writeFileSync(dataFile, JSON.stringify(movie, null, 2));
    this.logger.infoSavedDataFile(dataFile);

    await this.gitHubApi.addComment(gitHubIssueNumber, join(gitHubComments, '\n'));
    await this.gitHubApi.close(gitHubIssueNumber);
  }

  private async omdbSearch(imdbId: string) {
    try {
      const data = await this.omdbApi.search(imdbId);
      return { success: true, data, errors: [] };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Omdb Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { success: false, data: null, errors: [new Error(message, { cause })] };
    }
  }

  private async subdlSearch(imdbId: string) {
    try {
      const dataRaw = await this.subdlApi.search(imdbId);
      const errorsRaw = map(dataRaw.subtitles, (s) => s.errors);
      const errors = flattenDeep(errorsRaw);
      const subtitlesRaw = filter(dataRaw.subtitles, (s) => s.data !== null);
      const subtitles = map(subtitlesRaw, (s) => ({
        author: s.data.author,
        zipFile: s.data.zipFile,
        srtFile: s.data.srtFile,
        subtitles: s.data.srtText,
        // subtitles: parseSrt(s.data.srtText),
      }));
      const data = { ...dataRaw, subtitles };
      return { success: true, data, errors };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { success: false, data: null, errors: [new Error(message, { cause })] };
    }
  }
}
