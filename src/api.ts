import axios from "axios";
import { Types, TypeShows, Category } from "./utils";

const API_KEY = "7a3c084d5c72069caa104e491d6c86ce";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  genres: {
    id: number;
    name: string;
  };
  backdrop_path: string;
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetDetailMovie {
  adult: boolean;
  backdrop_path: string;
  genres: {
    id: number;
    name: string;
  }[];
  original_title: string;
  overview: string;
  vote_average: number;
}

interface ITvShow {
  backdrop_path: string;
  first_air_date: string;
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  number_of_episodes: number;
  number_of_seasons: number;
}

export interface ITvShows {
  page: number;
  results: ITvShow[];
  total_pages: number;
}

export interface IGetTvResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

interface ISearchResult {
  id: number;
  name?: string;
  title?: string;
}

export interface IGetSearchKey {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export function getMovies(type: Types) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTv(type: TypeShows) {
  return fetch(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export async function getSearchKey(keyword: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false&region=KR`
    )
  ).json();
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export async function getSearchTv(keyword: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko&&page=1&query=${keyword}&include_adult=false`
    )
  ).json();
}
