import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/css/Shows.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [category, setCategory] = useState("popular");
  const [loading, setLoading] = useState(true);

  const getRegion = () => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const regionMatch = locale.match(/-([A-Z]{2})$/);

    return regionMatch ? regionMatch[1] : "US";
  };

  const region = getRegion();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);

        let allResults = [];

        for (let page = 1; page <= 3; page++) {
          const response = await axios.get(
            `${BASE_URL}/tv/${category}`,
            {
              params: {
                api_key: API_KEY,
                language: "en-US",
                region,
                page,
              },
            }
          );

          const englishShows = response.data.results.filter(
            (show) => show.original_language === "en"
          );

          allResults = [...allResults, ...englishShows];
        }

        setShows(allResults);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [category, region]);

  const categoryLabels = {
    popular: "Popular TV Shows",
    airing_today: "Airing Today",
    on_the_air: "Currently on TV",
  };

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
    <main className="shows-page">
      <section className="shows-header">
        <div className="container">
          <p className="shows-eyebrow">Browse the Collection</p>

          <h1>{categoryLabels[category]}</h1>

          <div
            className="show-category-tabs"
            role="group"
            aria-label="TV show categories"
          >
            <button
              type="button"
              className={
                category === "popular"
                  ? "show-category-tab active"
                  : "show-category-tab"
              }
              onClick={() => setCategory("popular")}
            >
              Popular
            </button>

            <button
              type="button"
              className={
                category === "airing_today"
                  ? "show-category-tab active"
                  : "show-category-tab"
              }
              onClick={() => setCategory("airing_today")}
            >
              Airing Today
            </button>

            <button
              type="button"
              className={
                category === "on_the_air"
                  ? "show-category-tab active"
                  : "show-category-tab"
              }
              onClick={() => setCategory("on_the_air")}
            >
              On the Air
            </button>
          </div>
        </div>
      </section>

      <section className="shows-grid-section">
        <div className="container">
          {loading ? (
            <div className="shows-loading">Loading TV shows...</div>
          ) : (
            <div className="shows-grid">
              {shows.map((show) => (
                <Link
                  to={`/shows/${show.id}`}
                  className="show-card-link"
                  key={show.id}
                >
                  <article className="show-card">
                    <div className="show-poster-container">
                      <img
                        src={
                          show.poster_path
                            ? `${IMAGE_BASE_URL}/w500${show.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={show.name}
                        className="show-poster"
                      />

                      {show.vote_average > 0 && (
                        <div className="show-rating">
                          <i className="fa-solid fa-star"></i>
                          {show.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="show-info">
                      <h2 className="show-title">
                        {show.name}
                      </h2>

                      <p className="show-air-date">
                        {formatAirDate(show.first_air_date)}
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

export default Shows;