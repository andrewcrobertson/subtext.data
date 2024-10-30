import { searchNRecentMovies, showNRecentMovies } from '$lib/isomorphic.constants/movies';
import { Gateway } from '$lib/ui.services/Gateway';
import { api } from './api';
import { baseApi } from './baseApi';
import { imageLoader } from './imageLoader';
import { myListMovieIdManager } from './myListMovieIdManager';

export const gateway = new Gateway(baseApi, showNRecentMovies, searchNRecentMovies, api, myListMovieIdManager, imageLoader);
