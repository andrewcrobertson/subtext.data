import { cleanEnv, str } from 'envalid';

export const environment = cleanEnv(process.env, {
  // GitHub Config
  GITHUB_TOKEN: str({}),
  // OMDB Config
  OMDB_TOKEN: str({}),
  // SUBDL Config
  SUBDL_TOKEN: str({}),
});
