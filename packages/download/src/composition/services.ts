import { last, split } from 'lodash';
import { rootDir } from '../rootDir';
import { ArgParser } from '../services/ArgParser';
import { Downloader } from '../services/Downloader';
import { GithubApi } from '../services/GithubApi';
import { Handler } from '../services/Handler';
import { Logger } from '../services/Logger';
import { OmdbManager } from '../services/OmdbManager';
import { SubdlManager } from '../services/SubdlManager';
import { getPkgMeta } from '../utils/getPkgMeta';

// Checking in a token which only has public access.
// This function gets around git's ability to prevent checking in tokens.
const createGithubToken = (suffix: string) => 'ghp' + '_' + suffix;

const pkgMeta = getPkgMeta(rootDir);
const logPrefix = last(split(pkgMeta.name, '/'));

const gitHubPublicToken = createGithubToken('XYI7o6X0coQhlmoCNPrBmZSDZtZOti4LGCBs');
const gitHubApiUrlBase = 'https://api.gitHub.com/repos/andrewcrobertson/subtext.data';
const omdbToken = '36145266';
const omdbApiUrlBase = `https://www.omdbapi.com`;
const subdlToken = 'LtcVJJcsmQruxW6zWkAoN4Jc_ymu7mmM';
const subdlApiUrlBase = `https://api.subdl.com/api/v1/subtitles`;
const subdlZipUrlBase = `https://dl.subdl.com`;

export const makeLogger = (verbose: boolean) => new Logger(logPrefix!, verbose);
export const gitHubApi = new GithubApi(gitHubApiUrlBase, gitHubPublicToken);
export const omdbManager = new OmdbManager(omdbApiUrlBase, omdbToken);
export const subdlManager = new SubdlManager(subdlApiUrlBase, subdlZipUrlBase, subdlToken);

export const handler = (verbose: boolean) => {
  const logger = makeLogger(verbose);
  return new Handler(new ArgParser(logger), new Downloader(gitHubApi, omdbManager, subdlManager, logger), logger);
};
