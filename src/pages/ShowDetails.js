import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/ShowDetails.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const ShowDetails = () => {
  const { id } = useParams();

  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);

        const [
          showResponse,
          castResponse,
          trailerResponse,
          reviewsResponse,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/tv/${id}`, {
            params: {
              api_key: API_KEY,
              language: "en-US",
            },
          }),

          axios.get(`${BASE_URL}/tv/${id}/credits`, {
            params: {
              api_key: API_KEY,
              language: "en-US",
            },
          }),

          axios.get(`${BASE_URL}/tv/${id}/videos`, {
            params: {
              api_key: API_KEY,
              language: "en-US",
            },
          }),

          axios.get(`${BASE_URL}/tv/${id}/reviews`, {
            params: {
              api_key: API_KEY,
              language: "en-US",
              page: 1,
            },
          }),
        ]);

        setShow(showResponse.data);
        setCast(castResponse.data.cast.slice(0, 12));
        setReviews(reviewsResponse.data.results.slice(0, 3));

        const trailerData = trailerResponse.data.results.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

        if (trailerData) {
          setTrailer(
            `https://www.youtube.com/watch?v=${trailerData.key}`
          );
        } else {
          setTrailer("");
        }
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "Unavailable";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const formatRuntime = (runtime) => {
    if (!runtime) {
      return "Runtime unavailable";
    }

    return `${runtime} min`;
  };

  const getStatusText = () => {
    if (!show) return "";

    if (show.status === "Ended") {
      return "Ended";
    }

    if (show.in_production) {
      return "Returning Series";
    }

    return show.status || "Status unavailable";
  };

  const toggleReview = (reviewId) => {
    setExpandedReviews((previousReviews) => ({
      ...previousReviews,
      [reviewId]: !previousReviews[reviewId],
    }));
  };

  if (loading) {
    return (
      <div className="show-details-loading">
        Loading TV show details...
      </div>
    );
  }

  if (!show) {
    return (
      <div className="show-details-loading">
        TV show details could not be loaded.
      </div>
    );
  }

  const runtime =
    show.episode_run_time?.length > 0
      ? show.episode_run_time[0]
      : null;

  const startYear = show.first_air_date
    ? new Date(`${show.first_air_date}T00:00:00`).getFullYear()
    : null;

  const endYear = show.last_air_date
    ? new Date(`${show.last_air_date}T00:00:00`).getFullYear()
    : null;

  const yearRange =
    startYear && endYear && startYear !== endYear
      ? `${startYear}–${endYear}`
      : startYear || "Year unavailable";

  return (
    <main className="show-details-page">
      <section
        className="show-details-hero"
        style={{
          backgroundImage: show.backdrop_path
            ? `url(${IMAGE_BASE_URL}/original${show.backdrop_path})`
            : "none",
        }}
      >
        <div className="show-details-overlay"></div>

        <div className="container show-details-hero-content">
          <div className="show-details-poster-column">
            <img
              src={
                show.poster_path
                  ? `${IMAGE_BASE_URL}/w500${show.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={show.name}
              className="show-details-poster"
            />
          </div>

          <div className="show-details-content">
            <p className="show-details-eyebrow">
              TV Series
            </p>

            <h1>{show.name}</h1>

            {show.tagline && (
              <p className="show-details-tagline">
                {show.tagline}
              </p>
            )}

            <div className="show-details-meta">
              <span>
                <i className="fa-solid fa-star"></i>
                {show.vote_average
                  ? show.vote_average.toFixed(1)
                  : "N/A"}
              </span>

              <span>{yearRange}</span>

              <span>{formatRuntime(runtime)}</span>

              <span>{getStatusText()}</span>
            </div>

            {show.genres?.length > 0 && (
              <div className="show-details-genres">
                {show.genres.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>
            )}

            <div className="show-details-overview">
              <h2>Overview</h2>

              <p>
                {show.overview ||
                  "No overview is currently available for this show."}
              </p>
            </div>

            <div className="show-details-facts">
              <div>
                <span className="show-fact-label">
                  First air date
                </span>

                <span>{formatDate(show.first_air_date)}</span>
              </div>

              <div>
                <span className="show-fact-label">
                  Last air date
                </span>

                <span>{formatDate(show.last_air_date)}</span>
              </div>

              <div>
                <span className="show-fact-label">
                  Seasons
                </span>

                <span>{show.number_of_seasons || "Unavailable"}</span>
              </div>

              <div>
                <span className="show-fact-label">
                  Episodes
                </span>

                <span>{show.number_of_episodes || "Unavailable"}</span>
              </div>
            </div>

            {trailer && (
              <a
                href={trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="show-trailer-button"
              >
                <i className="fa-solid fa-play"></i>
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="show-cast-section">
        <div className="container">
          <div className="show-section-heading">
            <p>Meet the Characters</p>
            <h2>Cast</h2>
          </div>

          {cast.length > 0 ? (
            <div className="show-cast-scroll">
              {cast.map((actor) => (
                <Link
                  to={`/people/${actor.id}`}
                  key={`${actor.id}-${actor.cast_id}`}
                  className="show-cast-link"
                >
                  <article className="show-cast-card">
                    <img
                      src={
                        actor.profile_path
                          ? `${IMAGE_BASE_URL}/w300${actor.profile_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={actor.name}
                    />

                    <div className="show-cast-info">
                      <h3>{actor.name}</h3>

                      <p>
                        {actor.character ||
                          "Character unavailable"}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="show-empty-message">
              Cast information is unavailable.
            </p>
          )}
        </div>
      </section>

      <section className="show-reviews-section">
        <div className="container">
          <div className="show-section-heading show-section-heading-light">
            <p>Viewer Reactions</p>
            <h2>Reviews</h2>
          </div>

          {reviews.length > 0 ? (
            <div className="show-reviews-grid">
              {reviews.map((review) => {
                const avatarPath =
                  review.author_details?.avatar_path;

                const avatarUrl = avatarPath
                  ? avatarPath.startsWith("/http")
                    ? avatarPath.substring(1)
                    : `${IMAGE_BASE_URL}/w185${avatarPath}`
                  : null;

                const isExpanded =
                  expandedReviews[review.id];

                const shouldTruncate =
                  review.content.length > 300;

                return (
                  <article
                    key={review.id}
                    className="show-review-card"
                  >
                    <div className="show-review-author">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={review.author}
                        />
                      ) : (
                        <div className="show-review-avatar-placeholder">
                          {review.author
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h3>{review.author}</h3>

                        {review.author_details?.rating && (
                          <p>
                            <i className="fa-solid fa-star"></i>
                            {review.author_details.rating}/10
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="show-review-content">
                      {shouldTruncate && !isExpanded
                        ? `${review.content.substring(0, 300)}...`
                        : review.content}
                    </p>

                    {shouldTruncate && (
                      <button
                        type="button"
                        className="show-read-more-button"
                        onClick={() =>
                          toggleReview(review.id)
                        }
                      >
                        {isExpanded
                          ? "Show Less"
                          : "Read More"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="show-empty-message show-empty-message-light">
              No reviews are currently available.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ShowDetails;