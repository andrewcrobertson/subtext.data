export interface ApiSearchResponseResult {
  sd_id: number;
  type: string;
  name: string;
  imdb_id: string;
  tmdb_id: number;
  first_air_date: string;
  release_date: string;
  year: number;
}

export interface ApiSearchResponseSubtitle {
  release_name: string;
  name: string;
  lang: string;
  author: string;
  url: string;
  subtitlePage: string;
  season: number | null;
  episode: number | null;
  language: string;
  hi: boolean;
  episode_from: number | null;
  episode_end: number | number;
  full_season: boolean;
}

export interface ApiSearchResponse {
  status: boolean;
  results: ApiSearchResponseResult[];
  subtitles: ApiSearchResponseSubtitle[];
}

export interface GetInfoResponse {
  imdbId: string;
  title: string | null;
  releaseDate: string | null;
  year: number | null;
  subtitles: GetInfoSubtitle[];
}

export interface GetInfoSubtitleData {
  author: string | null;
  zipFile: string | null;
  srtFile: string | null;
  srtText: string;
}

export interface GetInfoSubtitleOk {
  success: true;
  data: GetInfoSubtitleData;
  errors: Error[];
}

export interface GetInfoSubtitleFail {
  success: false;
  data: null;
  errors: Error[];
}

export type GetInfoSubtitle = GetInfoSubtitleOk | GetInfoSubtitleFail;
