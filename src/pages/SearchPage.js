import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../components/css/SearchPage.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const SearchResults = () => {
  const location = useLocation();

  const query =
    new URLSearchParams(location.search).get("q")?.trim() ||
    "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${BASE_URL}/search/multi`,
          {
            params: {
              api_key: API_KEY,
              language: "en-US",
              query,
              include_adult: false,
              page: 1,
            },
          }
        );

        const filteredResults = response.data.results.filter(
          (item) => {
            const supportedType = [
              "movie",
              "tv",
              "person",
            ].includes(item.media_type);

            if (!supportedType) {
              return false;
            }

            if (
              item.media_type === "movie" ||
              item.media_type === "tv"
            ) {
              return item.original_language === "en";
            }

            return true;
          }
        );

        setResults(filteredResults);
      } catch (requestError) {
        console.error(
          "Error fetching search results:",
          requestError
        );

        setError(
          "We couldn't load your search results. Please try again."
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const getItemDetails = (item) => {
    if (item.media_type === "movie") {
      return {
        link: `/movies/${item.id}`,
        title: item.title,
        image: item.poster_path,
        typeLabel: "Movie",
        date: item.release_date,
        rating: item.vote_average,
        detail: formatDate(item.release_date),
      };
    }

    if (item.media_type === "tv") {
      return {
        link: `/shows/${item.id}`,
        title: item.name,
        image: item.poster_path,
        typeLabel: "TV Show",
        date: item.first_air_date,
        rating: item.vote_average,
        detail: formatDate(item.first_air_date),
      };
    }

    return {
      link: `/people/${item.id}`,
      title: item.name,
      image: item.profile_path,
      typeLabel: "Person",
      date: "",
      rating: null,
      detail:
        item.known_for_department ||
        "Entertainment",
    };
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
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
    <main className="search-results-page">
      <section className="search-results-hero">
        <div className="container">
          <p className="search-results-eyebrow">
            Explore ScreenSync
          </p>

          <h1>Search Results</h1>

          {query ? (
            <p className="search-results-summary">
              Results for <strong>“{query}”</strong>
            </p>
          ) : (
            <p className="search-results-summary">
              Enter a movie, television show, or person in
              the search bar.
            </p>
          )}
        </div>
      </section>

      <section className="search-results-content">
        <div className="container">
          {!query ? (
            <div className="search-results-message">
              <div className="search-message-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <h2>What are you looking for?</h2>

              <p>
                Search for movies, television shows, actors,
                directors, and more.
              </p>
            </div>
          ) : loading ? (
            <div className="search-results-grid">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    className="search-card-skeleton"
                    key={index}
                    aria-hidden="true"
                  >
                    <div className="search-skeleton-image"></div>

                    <div className="search-skeleton-info">
                      <div className="search-skeleton-line search-skeleton-title"></div>
                      <div className="search-skeleton-line search-skeleton-small"></div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : error ? (
            <div className="search-results-message">
              <div className="search-message-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>

              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="search-results-toolbar">
                <p>
                  <strong>{results.length}</strong>{" "}
                  {results.length === 1
                    ? "result"
                    : "results"}{" "}
                  found
                </p>
              </div>

              <div className="search-results-grid">
                {results.map((item) => {
                  const itemDetails =
                    getItemDetails(item);

                  return (
                    <Link
                      to={itemDetails.link}
                      className="search-result-link"
                      key={`${item.media_type}-${item.id}`}
                    >
                      <article className="search-result-card">
                        <div className="search-result-image-wrapper">
                          {itemDetails.image ? (
                            <img
                              src={`${IMAGE_BASE_URL}/w500${itemDetails.image}`}
                              alt={itemDetails.title}
                              className="search-result-image"
                            />
                          ) : (
                            <div className="search-result-placeholder">
                              <i
                                className={
                                  item.media_type ===
                                  "person"
                                    ? "fa-solid fa-user"
                                    : "fa-solid fa-film"
                                }
                              ></i>

                              <span>
                                Image unavailable
                              </span>
                            </div>
                          )}

                          <span className="search-result-type">
                            {itemDetails.typeLabel}
                          </span>

                          {itemDetails.rating > 0 && (
                            <span className="search-result-rating">
                              <i className="fa-solid fa-star"></i>
                              {itemDetails.rating.toFixed(1)}
                            </span>
                          )}

                          <div className="search-result-overlay">
                            <span>
                              View Details
                              <i className="fa-solid fa-arrow-right"></i>
                            </span>
                          </div>
                        </div>

                        <div className="search-result-info">
                          <h2>{itemDetails.title}</h2>

                          <p>{itemDetails.detail}</p>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="search-results-message">
              <div className="search-message-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <h2>No results found</h2>

              <p>
                We couldn’t find anything matching “
                {query}”. Try another title, name, or
                spelling.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SearchResults;