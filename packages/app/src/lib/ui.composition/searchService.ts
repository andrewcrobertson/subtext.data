import { showNRecentMovies } from '$lib/isomorphic.constants/movies';
import { SearchService } from '$lib/ui.services/SearchService';
import { api } from './api';
import { myListManager } from './myListManager';

export const searchService = new SearchService(showNRecentMovies, api, myListManager);
