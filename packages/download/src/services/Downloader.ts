import fs from 'fs';
import { concat, isError, join, map } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { GithubApi } from './GithubApi';
import type { Logger } from './Logger';
import type { OmdbManager } from './OmdbManager';
import type { SubdlManager } from './SubdlManager';

export class Downloader {
  public constructor(
    private readonly gitHubApi: GithubApi,
    private readonly omdbManager: OmdbManager,
    private readonly subdlManager: SubdlManager,
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

    const omdbInfoRes = await this.omdbManager.getInfo(imdbId);
    const getInfoRes = await this.subdlManager.getInfo(imdbId);
    const errors = concat(omdbInfoRes.errors, getInfoRes.errors);
    const errorText = map(errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    const title = omdbInfoRes.data!.title ?? getInfoRes.data!.title ?? 'Unknown Title';

    this.logger.infoTitle(title);
    this.logger.infoProcessing(gitHubIssueNumber, imdbId);
    gitHubComments.push(`**${title}**`);

    if (omdbInfoRes.success) {
      this.logger.infoMovieMetadataFound();
      gitHubComments.push(`:heavy_check_mark: Metadata found`);
    } else {
      this.logger.infoMovieMetadataNotFound();
      gitHubComments.push(`:heavy_multiplication_x: Metadata not found`);
    }

    if (getInfoRes.data!.options.length > 0) {
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

    const ext = path.parse(path.basename(omdbInfoRes.data!.poster!)).ext;
    const response = await fetch(omdbInfoRes.data!.poster!);
    const fileStream = fs.createWriteStream(path.resolve(posterDir, `${imdbId}${ext}`));
    await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);

    const movie = { ...getInfoRes.data, ...omdbInfoRes, poster: `posters/${imdbId}${ext}` };
    fs.writeFileSync(path.resolve(dataDir, `${imdbId}.json`), JSON.stringify(movie, null, 2));

    await this.gitHubApi.addComment(gitHubIssueNumber, join(gitHubComments, '\n'));
    await this.gitHubApi.close(gitHubIssueNumber);
  }
}
