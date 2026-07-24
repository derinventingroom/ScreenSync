import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/Hero.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [movieLogo, setMovieLogo] = useState(null);
  const [movieTrailer, setMovieTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovie = async () => {
      try {
        setLoading(true);

        const trendingResponse = await axios.get(
          `${BASE_URL}/trending/movie/day`,
          {
            params: {
              api_key: API_KEY,
              language: "en-US",
            },
          }
        );

        const featuredMovie = trendingResponse.data.results.find(
          (result) =>
            result.original_language === "en" &&
            result.backdrop_path
        );

        if (!featuredMovie) {
          throw new Error(
            "No suitable featured movie was found."
          );
        }

        const [
          detailsResponse,
          imagesResponse,
          videosResponse,
        ] = await Promise.all([
          axios.get(
            `${BASE_URL}/movie/${featuredMovie.id}`,
            {
              params: {
                api_key: API_KEY,
                language: "en-US",
                append_to_response: "release_dates",
              },
            }
          ),

          axios.get(
            `${BASE_URL}/movie/${featuredMovie.id}/images`,
            {
              params: {
                api_key: API_KEY,
                include_image_language: "en,null",
              },
            }
          ),

          axios.get(
            `${BASE_URL}/movie/${featuredMovie.id}/videos`,
            {
              params: {
                api_key: API_KEY,
                language: "en-US",
              },
            }
          ),
        ]);

        setMovie(detailsResponse.data);

        const logos = imagesResponse.data.logos || [];

        const selectedLogo =
          logos.find(
            (logo) => logo.iso_639_1 === "en"
          ) ||
          logos.find(
            (logo) => logo.iso_639_1 === null
          ) ||
          logos[0];

        if (selectedLogo) {
          setMovieLogo(selectedLogo.file_path);
        }

        const videos = videosResponse.data.results || [];

        const selectedTrailer =
          videos.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official
          ) ||
          videos.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer"
          ) ||
          videos.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Teaser"
          );

        if (selectedTrailer) {
          setMovieTrailer(selectedTrailer.key);
        }
      } catch (error) {
        console.error(
          "Error fetching trending movie:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovie();
  }, []);

  useEffect(() => {
    if (!showTrailer) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowTrailer(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [showTrailer]);

  if (loading) {
    return (
      <div className="hero hero-loading">
        Loading featured movie...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="hero hero-loading">
        Featured movie unavailable.
      </div>
    );
  }

  const shortenedOverview =
    movie.overview?.length > 200
      ? `${movie.overview.substring(0, 200)}...`
      : movie.overview;

  const releaseYear = movie.release_date
    ? new Date(
        `${movie.release_date}T00:00:00`
      ).getFullYear()
    : "";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${
        movie.runtime % 60
      }m`
    : "";

  const genres = movie.genres
    ?.map((genre) => genre.name)
    .join(" • ");

  const usRelease = movie.release_dates?.results?.find(
    (country) => country.iso_3166_1 === "US"
  );

  const certification =
    usRelease?.release_dates?.find(
      (release) => release.certification
    )?.certification || "";

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="container">
          <div className="hero-content">
            {movieLogo ? (
              <img
                src={`${IMAGE_BASE_URL}/w500${movieLogo}`}
                alt={`${movie.title} logo`}
                className="hero-movie-logo"
              />
            ) : (
              <h1>{movie.title}</h1>
            )}

            <div className="hero-meta">
              {movie.vote_average > 0 && (
                <span>
                  <i className="fas fa-star"></i>
                  {movie.vote_average.toFixed(1)}
                </span>
              )}

              {releaseYear && (
                <span>{releaseYear}</span>
              )}

              {genres && <span>{genres}</span>}

              {runtime && <span>{runtime}</span>}

              {certification && (
                <span className="rating">
                  Rated {certification}
                </span>
              )}
            </div>

            {shortenedOverview && (
              <p>{shortenedOverview}</p>
            )}

            <div className="hero-buttons">
              <button
                type="button"
                className="btn btn-trailer btn-primary"
                onClick={() => setShowTrailer(true)}
                disabled={!movieTrailer}
                title={
                  movieTrailer
                    ? `Watch ${movie.title} trailer`
                    : "Trailer unavailable"
                }
              >
                <i className="fas fa-play play-icon"></i>
                Watch Trailer
              </button>

              <Link
                to={`/movies/${movie.id}`}
                className="btn btn-clear"
              >
                <i className="fa-solid fa-circle-info"></i>
                Overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {showTrailer && movieTrailer && (
        <div
          className="hero-trailer-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${movie.title} trailer`}
          onClick={closeTrailer}
        >
          <div
            className="hero-trailer-dialog"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="hero-trailer-close"
              onClick={closeTrailer}
              aria-label="Close trailer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="hero-trailer-video">
              <iframe
                src={`https://www.youtube.com/embed/${movieTrailer}?autoplay=1&rel=0`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;