import {
  PathMatch,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "react-query";
import {
  getSearchKey,
  getSearchMovie,
  getSearchTv,
  IGetMoviesResult,
  IGetSearchKey,
  IGetTvResult,
} from "../api";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useForm } from "react-hook-form";
import { IForm } from "../Components/Header";
import { Category, makeImagePath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from "../useWindowDimensions";
import { useState } from "react";

const SliderWrap = styled.div`
  position: relative;
  height: 500px;
  margin-bottom: 80px;
  top: 0px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
  margin-bottom: 10px;
  position: absolute;
  width: 100%;
  overflow: hidden;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Overview = styled.span`
  font-size: 26px;
  width: 50%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  opacity: 0;
  position: relative;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 60vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 250px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.div`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2`
  font-size: 25px;
  font-weight: 800;
  text-align: center;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  right: 0;
  left: 0;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 3;
`;

const SearchSubmit = styled.form`
  color: white;
  svg {
    height: 25px;
  }
  display: flex;
  align-items: center;
  position: relative;
`;

const Input = styled(motion.input)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 500px;
  margin-top: 30px;
  padding: 10px 10px;
  color: white;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const SearchWrap = styled.div`
  width: 100%;
  height: 100vh;
`;

const SearchTitle = styled.h2`
  display: flex;
  margin: 50px 0px;
  font-size: 40px;
  padding: 60px;
  text-align: center;

  span {
    color: ${(props) => props.theme.red};
  }

  @media (max-width: 700px) {
    font-size: 25px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 3px;
  }
  margin-bottom: 5px;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Search = () => {
  const location = useLocation();
  const { scrollY } = useScroll();
  const width = useWindowDimensions();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const bigMovieMatch: PathMatch<string> | null = useMatch("/search");

  // const { data: keyData, isLoading: keyLoading } = useQuery<IGetSearchKey>(
  //   ["search", "key"],
  //   () => getSearchKey(keyword!),
  //   { enabled: !!keyword }
  // );
  const { data: movieData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(
      ["search", "movie"],
      () => getSearchMovie(keyword!),
      { enabled: !!keyword }
    );
  // const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
  //   ["search", "tv"],
  //   () => getSearchTv(keyword!),
  //   { enabled: !!keyword }
  // );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (keyword: string, movieId: number) => {
    navigate(`/search?keyword=${keyword}/${movieId}`);
  };
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const navigate = useNavigate();

  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
    setValue("keyword", "");
  };

  const offset = 6;

  const clickedMovie =
    bigMovieMatch?.params.id &&
    movieData?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.id)
    );

  return (
    <>
      {keyword === null ? (
        <SearchSubmit onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            transition={{ type: "linear" }}
            placeholder="Search for movie or tv show"
            autoComplete="off"
          />
        </SearchSubmit>
      ) : (
        <>
          {movieLoading ? (
            <div>Loading...</div>
          ) : (
            <SearchWrap>
              <SearchTitle>
                <span>{keyword}</span>
                (을)를 검색한 결과입니다.
              </SearchTitle>
              <Banner
                onClick={increaseIndex}
                bgPhoto={makeImagePath(
                  movieData?.results[0].backdrop_path || ""
                )}
              >
                <Title>{movieData?.results[0].title}</Title>
                <Overview>{movieData?.results[0].overview}</Overview>
              </Banner>
              <SliderWrap>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    initial={{ x: width + 10 }}
                    animate={{ x: 0 }}
                    exit={{ x: -width - 10 }}
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                  >
                    {movieData?.results
                      .slice(offset * index, offset * index + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(keyword, movie.id)}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <span>{movie.release_date.substring(0, 4)}</span>
                            <span>{movie.title}</span>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </SliderWrap>

              <AnimatePresence>
                {bigMovieMatch ? (
                  <>
                    <Overlay
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        navigate(`/search?keyword=${keyword}`);
                      }}
                    />
                    <BigMovie
                      style={{ top: scrollY.get() + 100 }}
                      layoutId={bigMovieMatch.params.movieId}
                    >
                      {clickedMovie && (
                        <>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                clickedMovie.backdrop_path,
                                "w500"
                              )})`,
                            }}
                          />
                          <BigTitle>{clickedMovie.title}</BigTitle>

                          <BigOverview>
                            <Header>
                              <FontAwesomeIcon icon={faStar} />
                              <span>{clickedMovie.vote_average}</span>
                            </Header>
                            {clickedMovie.overview}
                            <span>{clickedMovie.release_date}</span>
                          </BigOverview>
                        </>
                      )}
                    </BigMovie>
                  </>
                ) : null}
              </AnimatePresence>
            </SearchWrap>
          )}
        </>
      )}
    </>
  );
};

export default Search;
