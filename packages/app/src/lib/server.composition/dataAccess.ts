import { DataAccess } from '$lib/server.services/DataAccess';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const dirPath = path.resolve(__dirname, '..', 'server.data');

export const dataAccess = new DataAccess(dirPath);
