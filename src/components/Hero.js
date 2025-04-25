import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./css/Hero.css";

const Hero = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Fetch trending movies
    const fetchTrendingMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=7ff29f44e328a4c9a0fd467d2c5afffa`
        );
        setMovie(response.data.results[0]);
        // console.log(movie);
      } catch (error) {
        console.error("Error fetching trending movie:", error);
      }
    };

    fetchTrendingMovie();
  }, []);

  if (!movie) {
    return <div>Loading...</div>; 
  }

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="container">
      <div className="hero-content">
        
          <h1>{movie.title}</h1>
          <p>{movie.overview.length > 200 ? movie.overview.substring(0, 200) + "..." : movie.overview}</p>
          <Link to={`/movies/${movie.id}`} className="btn">Overview</Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
