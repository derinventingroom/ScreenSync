import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/PopularMovies.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/movie/popular`,
          {
            params: {
              api_key: API_KEY,
              language: "en-US",
              region: "US",
              page: 1,
            },
          }
        );

        const filteredMovies = response.data.results
          .filter(
            (movie) =>
              movie.poster_path &&
              movie.original_language === "en"
          )
          .slice(0, 4);

        setMovies(filteredMovies);
      } catch (error) {
        console.error(
          "Error fetching popular movies:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  const formatReleaseDate = (date) => {
    if (!date) {
      return "Release date unavailable";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <section className="home-popular-movies">
      <div className="container">
        <div className="home-section-heading">
          <div>
            <p className="home-section-eyebrow">
              Trending Now
            </p>

            <h2>Popular Movies</h2>
          </div>

          <Link
            to="/movies"
            className="home-section-view-all"
          >
            View All Movies
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="popular-movies-loading">
            Loading popular movies...
          </div>
        ) : movies.length > 0 ? (
          <div className="popular-movies-grid">
            {movies.map((movie) => (
              <Link
                to={`/movies/${movie.id}`}
                className="popular-movie-link"
                key={movie.id}
              >
                <article className="popular-movie-card">
                  <div className="popular-movie-poster-wrapper">
                    <img
                      src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="popular-movie-poster"
                    />

                    {movie.vote_average > 0 && (
                      <div className="popular-movie-rating">
                        <i className="fa-solid fa-star"></i>
                        {movie.vote_average.toFixed(1)}
                      </div>
                    )}

                    <div className="popular-movie-hover-overlay">
                      <span>
                        View Details
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>

                  <div className="popular-movie-info">
                    <h3>{movie.title}</h3>

                    <p>
                      {formatReleaseDate(
                        movie.release_date
                      )}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="popular-movies-empty">
            No popular movies are currently available.
          </p>
        )}
      </div>
    </section>
  );
};

export default PopularMovies;