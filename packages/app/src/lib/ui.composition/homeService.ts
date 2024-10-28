import { HomeService } from '$lib/ui.services/HomeService';
import { api } from './api';
import { myListManager } from './myListManager';

export const homeService = new HomeService(api, myListManager);
