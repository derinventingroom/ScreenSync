import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/PopularShows.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const PopularShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularShows = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/tv/popular`,
          {
            params: {
              api_key: API_KEY,
              language: "en-US",
              region: "US",
              page: 1,
            },
          }
        );

        const filteredShows = response.data.results
          .filter(
            (show) =>
              show.poster_path &&
              show.original_language === "en"
          )
          .slice(0, 4);

        setShows(filteredShows);
      } catch (error) {
        console.error(
          "Error fetching popular TV shows:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPopularShows();
  }, []);

  const formatAirDate = (date) => {
    if (!date) {
      return "Air date unavailable";
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
    <section className="home-popular-shows">
      <div className="container">
        <div className="home-shows-heading">
          <div>
            <p className="home-shows-eyebrow">
              Binge-Worthy Picks
            </p>

            <h2>Popular TV Shows</h2>
          </div>

          <Link
            to="/shows"
            className="home-shows-view-all"
          >
            View All Shows
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="popular-shows-loading">
            Loading popular TV shows...
          </div>
        ) : shows.length > 0 ? (
          <div className="popular-shows-grid">
            {shows.map((show) => (
              <Link
                to={`/shows/${show.id}`}
                className="popular-show-link"
                key={show.id}
              >
                <article className="popular-show-card">
                  <div className="popular-show-poster-wrapper">
                    <img
                      src={`${IMAGE_BASE_URL}/w500${show.poster_path}`}
                      alt={show.name}
                      className="popular-show-poster"
                    />

                    {show.vote_average > 0 && (
                      <div className="popular-show-rating">
                        <i className="fa-solid fa-star"></i>
                        {show.vote_average.toFixed(1)}
                      </div>
                    )}

                    <div className="popular-show-hover-overlay">
                      <span>
                        View Details
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>

                  <div className="popular-show-info">
                    <h3>{show.name}</h3>

                    <p>
                      {formatAirDate(show.first_air_date)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="popular-shows-empty">
            No popular TV shows are currently available.
          </p>
        )}
      </div>
    </section>
  );
};

export default PopularShows;