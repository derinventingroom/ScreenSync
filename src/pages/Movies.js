import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/css/Movies.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        let allResults = [];
        const today = new Date();

        for (let page = 1; page <= 3; page++) {
          const response = await axios.get(
            `${BASE_URL}/movie/${category}`,
            {
              params: {
                api_key: API_KEY,
                language: "en-US",
                region: "US",
                page,
              },
            }
          );

          const results = response.data.results.filter((movie) => {
            const releaseDate = movie.release_date
              ? new Date(`${movie.release_date}T00:00:00`)
              : null;

            const isValidUpcomingMovie =
              category !== "upcoming" ||
              (releaseDate && releaseDate >= today);

            const isEnglishLanguage =
              movie.original_language === "en";

            return isValidUpcomingMovie && isEnglishLanguage;
          });

          allResults = [...allResults, ...results];
        }

        if (category === "upcoming") {
          allResults.sort(
            (a, b) =>
              new Date(`${a.release_date}T00:00:00`) -
              new Date(`${b.release_date}T00:00:00`)
          );
        }

        setMovies(allResults);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  const categoryLabels = {
    popular: "Popular Movies",
    now_playing: "Now Playing",
    upcoming: "Upcoming Movies",
  };

  const formatReleaseDate = (date) => {
    if (!date) return "Release date unavailable";

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
    <main className="movies-page">
      <section className="movies-header">
        <div className="container">
          <p className="movies-eyebrow">Browse the Collection</p>
          <h1>{categoryLabels[category]}</h1>

          <div
            className="movie-category-tabs"
            role="group"
            aria-label="Movie categories"
          >
            <button
              type="button"
              className={
                category === "popular"
                  ? "category-tab active"
                  : "category-tab"
              }
              onClick={() => setCategory("popular")}
            >
              Popular
            </button>

            <button
              type="button"
              className={
                category === "now_playing"
                  ? "category-tab active"
                  : "category-tab"
              }
              onClick={() => setCategory("now_playing")}
            >
              Now Playing
            </button>

            <button
              type="button"
              className={
                category === "upcoming"
                  ? "category-tab active"
                  : "category-tab"
              }
              onClick={() => setCategory("upcoming")}
            >
              Upcoming
            </button>
          </div>
        </div>
      </section>

      <section className="movies-grid-section">
        <div className="container">
          {loading ? (
            <div className="movies-loading">
              Loading movies...
            </div>
          ) : (
            <div className="movies-grid">
              {movies.map((movie) => (
                <Link
                  to={`/movies/${movie.id}`}
                  className="movie-card-link"
                  key={movie.id}
                >
                  <article className="movie-card">
                    <div className="movie-poster-container">
                      <img
                        src={
                          movie.poster_path
                            ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.title}
                        className="movie-poster"
                      />

                      {movie.vote_average > 0 && (
                        <div className="movie-rating">
                          <i className="fa-solid fa-star"></i>
                          {movie.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="movie-info">
                      <h2 className="movie-title">
                        {movie.title}
                      </h2>

                      <p className="movie-release">
                        {formatReleaseDate(movie.release_date)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Movies;