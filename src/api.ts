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

export function getSearch(keyword: string, type: Category) {
  return fetch(
    `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
