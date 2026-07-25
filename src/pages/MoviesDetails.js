import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/MoviesDetails.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const [
          movieResponse,
          castResponse,
          trailerResponse,
          reviewsResponse,
        ] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

        setMovie(movieResponse.data);
        setCast(castResponse.data.cast.slice(0, 10));
        setReviews(reviewsResponse.data.results.slice(0, 3));

        const trailerData =
          trailerResponse.data.results.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official
          ) ||
          trailerResponse.data.results.find(
            (video) =>
              video.site === "YouTube" && video.type === "Trailer"
          );

        if (trailerData) {
          setTrailer(
            `https://www.youtube.com/watch?v=${trailerData.key}`
          );
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div className="movie-loading">Loading...</div>;
  }

  const releaseYear = movie.release_date
    ? new Date(`${movie.release_date}T00:00:00`).getFullYear()
    : "";

  const formattedReleaseDate = movie.release_date
    ? new Date(`${movie.release_date}T00:00:00`).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Release date unavailable";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "";

  const genres = movie.genres
    ?.map((genre) => genre.name)
    .join(" • ");

  return (
    <main className="movie-detail">
      <section
        className="movie-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="movie-hero-overlay"></div>

        <div className="container movie-hero-container">
          <div className="movie-hero-grid">
            <div className="movie-poster-wrapper">
              <img
                src={
                  movie.poster_path
                    ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="movie-poster"
              />
            </div>

            <div className="movie-data">
              <p className="movie-eyebrow">Featured Movie</p>

              <h1>
                {movie.title}
                {releaseYear && (
                  <span className="movie-year"> ({releaseYear})</span>
                )}
              </h1>

              <div className="movie-meta">
                <span className="movie-score">
                  <i className="fa-solid fa-star"></i>
                  {movie.vote_average?.toFixed(1)}
                </span>

                {runtime && <span>{runtime}</span>}

                {genres && <span>{genres}</span>}
              </div>

              {movie.tagline && (
                <p className="movie-tagline">{movie.tagline}</p>
              )}

              <div className="movie-overview">
                <h2>Overview</h2>
                <p>{movie.overview || "No overview is available."}</p>
              </div>

              <p className="movie-release-date">
                <strong>Release Date:</strong> {formattedReleaseDate}
              </p>

              {trailer && (
                <a
                  href={trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn movie-trailer-button"
                >
                  <i className="fa-solid fa-play"></i>
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="cast-section">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">Meet the Characters</p>
            <h2>Cast</h2>
          </div>

          <div className="cast-scroll">
            {cast.map((actor) => (
              <Link
                to={`/people/${actor.id}`}
                key={actor.id}
                className="cast-link"
              >
                <article className="cast-card">
                  <img
                    src={
                      actor.profile_path
                        ? `${IMAGE_BASE_URL}/w300${actor.profile_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={actor.name}
                  />

                  <div className="cast-card-content">
                    <h3>{actor.name}</h3>
                    <p>{actor.character || "Character unavailable"}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="container">
          <div className="section-heading">
            <p className="section-eyebrow">Audience Response</p>
            <h2>Reviews</h2>
          </div>

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map(
                (review) =>
                  review.content && (
                    <article key={review.id} className="review">
                      <div className="review-header">
                        <div className="review-avatar">
                          {review.author
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h3>{review.author}</h3>
                          <p>TMDB review</p>
                        </div>
                      </div>

                      <p className="review-content">
                        {expandedReviews[review.id] ||
                        review.content.length <= 300
                          ? review.content
                          : `${review.content.substring(0, 300)}...`}
                      </p>

                      {review.content.length > 300 && (
                        <button
                          type="button"
                          className="read-more-btn"
                          onClick={() =>
                            setExpandedReviews((previous) => ({
                              ...previous,
                              [review.id]:
                                !previous[review.id],
                            }))
                          }
                        >
                          {expandedReviews[review.id]
                            ? "Show Less"
                            : "Read More"}
                        </button>
                      )}
                    </article>
                  )
              )
            ) : (
              <p className="no-reviews">
                No reviews are currently available.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MovieDetails;