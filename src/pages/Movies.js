import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/css/Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("popular");
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
  const baseURL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchMovies = async () => {
        try {
            let allResults = [];
            const today = new Date();
        
            for (let page = 1; page <= 3; page++) {
              const response = await axios.get(
                `${baseURL}/movie/${category}?api_key=${apiKey}&language=en-US&region=US&page=${page}`
              );
        
              const results = response.data.results.filter(movie => {
                const releaseDate = new Date(movie.release_date);
                return category !== "upcoming" || releaseDate >= today;
              });
        
              allResults = [...allResults, ...results];
            }
        
            if (category === "upcoming") {
              allResults.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            }
        
            setMovies(allResults);
          } catch (error) {
            console.error("Error fetching movies:", error);
          }
    };

    fetchMovies();
  }, [category]);

  return (
    <div className="movies-page container py-4">
      <h2 className="mb-4 text-white">Movies - {category.replace("-", " ")}</h2>

      {/* Category Filter Buttons */}
      <div className="btn-group mb-4" role="group">
        <button
          className={`btn btn-outline-light ${category === "popular" ? "active" : ""}`}
          onClick={() => setCategory("popular")}
        >
          Popular
        </button>
        <button
          className={`btn btn-outline-light ${category === "now_playing" ? "active" : ""}`}
          onClick={() => setCategory("now_playing")}
        >
          Now Playing
        </button>
        <button
          className={`btn btn-outline-light ${category === "upcoming" ? "active" : ""}`}
          onClick={() => setCategory("upcoming")}
        >
          Upcoming
        </button>
      </div>

      {/* Movie Grid */}
      <div className="row">
        {movies.map((movie) => (

          <div className="col-6 col-md-4 col-lg-3 mb-4" key={movie.id}>
            <Link to={`/movies/${movie.id}`} className="text-decoration-none text-white">
            <div className="movie-card bg-dark text-white rounded p-2 h-100">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded mb-2"
              />
              <h5 className="movie-title">{movie.title}</h5>
              <p className="movie-release">Release: {movie.release_date}</p>
            </div>
            </Link>
          </div>

        ))}
      </div>
    </div>
  );
};

export default Movies;
