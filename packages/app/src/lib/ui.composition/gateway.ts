import { Gateway } from '$lib/ui.services/Gateway';
import { api } from './api';
import { myListManager } from './myListManager';

export const gateway = new Gateway(api, myListManager);
