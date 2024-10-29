import { ApiFetch } from '$lib/ui.services/ApiFetch';
import { ApiMemoryCache } from '$lib/ui.services/ApiMemoryCache';

export const apiFetch = new ApiFetch('https://raw.githubusercontent.com/andrewcrobertson/subtext.data/main/__data__/movies');
export const api = new ApiMemoryCache(apiFetch);
