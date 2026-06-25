import { motion } from "framer-motion";
import Hero from "../components/home/Hero";
import PopularMovies from "../components/home/PopularMovies";
import TopRatedMovies from "../components/home/TopRatedMovies";
import LatestMovies from "../components/home/LatestMovies";
import MoviesByGenre from "../components/home/MoviesByGenre";
import Glow from "../components/common/Glow";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />

      <div className="relative">
        <Glow color="primary" size="lg" className="absolute top-0 left-0" />
        <LatestMovies />
      </div>

      <div className="relative">
        <Glow color="secondary" size="lg" className="absolute top-0 right-0" />
        <PopularMovies />
      </div>

      <TopRatedMovies />

      <MoviesByGenre />
    </motion.div>
  );
};

export default Home;
