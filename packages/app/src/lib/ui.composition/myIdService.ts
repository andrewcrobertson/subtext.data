import { browser } from '$app/environment';
import { StorageBlobStore } from '$lib/isomorphic.services/StorageBlobStore';
import { MyIdService } from '$lib/ui.services/MyIdService';

const ls = browser && localStorage !== undefined ? localStorage : (undefined as unknown as Storage);
const blobStore = new StorageBlobStore<string>('my-id', ls);

export const myIdService = new MyIdService(blobStore);
