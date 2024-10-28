import { RequestService } from '$lib/ui.services/RequestService';
import { gitHubService } from './gitHubService';
import { myIdService } from './myIdService';

export const requestService = new RequestService(myIdService, gitHubService);
