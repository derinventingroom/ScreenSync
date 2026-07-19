import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./css/Hero.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [movieLogo, setMovieLogo] = useState(null);

  useEffect(() => {
    const fetchTrendingMovie = async () => {
      try {
        // Get the featured trending movie
        const trendingResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        );

        const featuredMovie = trendingResponse.data.results[0];

        // Get the full movie details, including release certifications
        const detailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${featuredMovie.id}?api_key=${API_KEY}&append_to_response=release_dates`
        );

        setMovie(detailsResponse.data);

        // Get the featured movie's image collection
        const imagesResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${featuredMovie.id}/images?api_key=${API_KEY}`
        );

        const logos = imagesResponse.data.logos || [];

        // Prefer an English logo, then a language-neutral logo,
        // and finally use any available logo.
        const selectedLogo =
          logos.find((logo) => logo.iso_639_1 === "en") ||
          logos.find((logo) => logo.iso_639_1 === null) ||
          logos[0];

        if (selectedLogo) {
          setMovieLogo(selectedLogo.file_path);
        }
      } catch (error) {
        console.error("Error fetching trending movie:", error);
      }
    };

    fetchTrendingMovie();
  }, []);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const shortenedOverview =
    movie.overview?.length > 200
      ? `${movie.overview.substring(0, 200)}...`
      : movie.overview;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
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

  return (
    <div
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
            <span>
              <i className="fas fa-star"></i>{" "}
              {movie.vote_average?.toFixed(1)}
            </span> |

            {releaseYear && <span>{releaseYear}</span>} |

            {genres && <span>{genres}</span>} |

            {runtime && <span>{runtime}</span>} |

            {certification && (
              <span className="rating">Rated {certification}</span>
            )}
          </div>

          {shortenedOverview && <p>{shortenedOverview}</p>}

          <div className="hero-buttons">
            <Link
              to={`/movies/${movie.id}`}
              className="btn btn-trailer btn-primary"
            >
              <i className="fas fa-play play-icon"></i> Watch Trailer
            </Link>

            <Link
              to={`/movies/${movie.id}`}
              className="btn btn-clear"
            >
              <i className="fa-solid fa-circle-info"></i> Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;