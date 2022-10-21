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

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTv() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
