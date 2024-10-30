import { PUBLIC_REPO_TOKEN } from '$env/static/public';
import { GitHubService } from '$lib/ui.services/GitHubService';

const baseApi = 'https://api.gitHub.com/repos/andrewcrobertson/subtext.data';
export const gitHubService = new GitHubService(PUBLIC_REPO_TOKEN, baseApi);
