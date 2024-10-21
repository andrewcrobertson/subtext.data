import { blue, cyan, green, magenta, red, yellow } from 'colorette';
import path from 'path';
import { ensureForwardSlash } from '../utils/ensureForwardSlash';

const quote = (value: string) => `'${value}'`;

export class Logger {
  public constructor(
    private readonly logPrefix: string,
    private readonly verbose: boolean
  ) {}

  public infoBlank() {
    this.logInfo('');
  }

  public infoStarting() {
    this.logInfo(magenta('=== Starting ==='));
  }

  public infoOpenGitHubIssuesFound(openIssueCount: number) {
    const issueP11n = openIssueCount > 1 ? 'issues' : 'issue';
    this.logInfo(`${green(openIssueCount)} open ${issueP11n} found`);
  }

  public infoProcessingOpenGitHubIssue(gitHubIssueNumber: number, imdbId: string) {
    this.logInfo(`GH ${green(gitHubIssueNumber)}/IMDB ${green(imdbId)} - processing`);
  }

  public infoMovieMetadataFound(gitHubIssueNumber: number, imdbId: string, title: string) {
    this.logInfo(`GH ${green(gitHubIssueNumber)}/IMDB ${green(imdbId)} - ${green(title)} metadata found`);
  }

  public infoMovieMetadataNotFound(gitHubIssueNumber: number, imdbId: string, title: string) {
    this.logInfo(`GH ${green(gitHubIssueNumber)}/IMDB ${green(imdbId)} - ${green(title)} metadata not found`);
  }

  public infoMovieSubtitlesFound(gitHubIssueNumber: number, imdbId: string, title: string) {
    this.logInfo(`GH ${green(gitHubIssueNumber)}/IMDB ${green(imdbId)} - ${green(title)} subtitles found`);
  }

  public infoMovieSubtitlesNotFound(gitHubIssueNumber: number, imdbId: string, title: string) {
    this.logInfo(`GH ${green(gitHubIssueNumber)}/IMDB ${green(imdbId)} - ${green(title)} subtitles not found`);
  }

  // public errorInvalidFileArgsInputFileNotExist(inputFile: string) {
  //   this.logError(`Could not find input file ${this.formatPath(inputFile)}`);
  // }

  public errorInvalidFileArgsOutput() {
    this.logError(`Please pass in an output`);
  }

  public infoFinished() {
    this.logInfo('Finished');
  }

  private formatPath(fileOrDir: string) {
    return cyan(quote(ensureForwardSlash(path.relative(process.cwd(), fileOrDir))));
  }

  private logInfo(message: string) {
    console.log(`${this.logPrefix} ${blue('info')} ${message}`);
  }

  private logWarn(message: string) {
    console.log(`${this.logPrefix} ${yellow('warn')} ${message}`);
  }

  private logError(message: string) {
    console.log(`${this.logPrefix} ${red('error')} ${message}`);
  }
}
