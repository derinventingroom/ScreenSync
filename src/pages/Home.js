// import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedTrailer from "../components/FeaturedTrailer";
import BetweenGradient from "../components/BetweenGradient";
import PopularMovies from "../components/PopularMovies";
import PopularShows from "../components/PopularShows";
import PopularPeople from "../components/PopularPeople";
// import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Hero />
      <FeaturedTrailer />
      <BetweenGradient />
      <PopularMovies />
      <PopularShows />
      <PopularPeople />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
