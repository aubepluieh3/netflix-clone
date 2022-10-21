import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { getTv, IGetTvResult } from "../api";
import { makeImagePath, TypeShows } from "../utils";
import useWindowDimensions from "../useWindowDimensions";
import { PathMatch, useNavigate, useMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

const Title = styled.span`
  font-size: 60px;
  margin-bottom: 20px; ;
`;

const Overview = styled.span`
  font-size: 26px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -70px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
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
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  span {
    text-align: center;
    font-size: 13px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigTv = styled(motion.div)`
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

const BigTitle = styled.div`
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
const offset = 6;

function Tv() {
  const navigate = useNavigate();
  const bigTvMatch: PathMatch<string> | null = useMatch("/tvs/:id");
  const { scrollY } = useScroll();
  const width = useWindowDimensions();
  const { data, isLoading } = useQuery<IGetTvResult>(
    ["tvs", "on_the_air"],
    () => getTv(TypeShows.on_the_air)
  );
  console.log(data, isLoading);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tvs/${tvId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    bigTvMatch?.params.id &&
    data?.results.find((tv) => tv.id === Number(bigTvMatch.params.id));

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                initial={{ x: width + 10 }}
                animate={{ x: 0 }}
                exit={{ x: -width - 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1) //배경으로 쓴 거 제외
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <span>{tv.name}</span>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>

                      <BigOverview>
                        <Header>
                          <FontAwesomeIcon icon={faStar} />
                          <span>{clickedTv.vote_average}</span>
                        </Header>
                        {clickedTv.overview}
                        <span>{clickedTv.first_air_date}</span>
                      </BigOverview>
                    </>
                  )}
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
