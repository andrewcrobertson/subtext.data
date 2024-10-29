import { RequestService } from '$lib/ui.services/RequestService';
import { gitHubService } from './gitHubService';
import { userIdService } from './myIdService';

export const requestService = new RequestService(userIdService, gitHubService);
