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

export interface SearchResponse {
  imdbId: string;
  title: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: SearchResponseSubtitle[];
}

export interface SearchResponseSubtitleData {
  author: string | null;
  zipFile: string | null;
  srtFile: string | null;
  srtText: string;
}

export interface SearchResponseSubtitleOk {
  success: true;
  data: SearchResponseSubtitleData;
  errors: Error[];
}

export interface SearchResponseSubtitleFail {
  success: false;
  data: null;
  errors: Error[];
}

export type SearchResponseSubtitle = SearchResponseSubtitleOk | SearchResponseSubtitleFail;
