import { useEffect, useState } from "react";
import axios from "axios";
import "./css/FeaturedTrailer.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const FeaturedTrailer = () => {
  const [trailers, setTrailers] = useState([]);
  const [playingTrailer, setPlayingTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTrailers = async () => {
      try {
        setLoading(true);

        const movieResponse = await axios.get(
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

        const popularMovies = movieResponse.data.results
          .filter(
            (movie) =>
              movie.original_language === "en" &&
              movie.backdrop_path
          )
          .slice(0, 10);

        const trailersWithDetails = await Promise.all(
          popularMovies.map(async (movie) => {
            try {
              const videoResponse = await axios.get(
                `${BASE_URL}/movie/${movie.id}/videos`,
                {
                  params: {
                    api_key: API_KEY,
                    language: "en-US",
                  },
                }
              );

              const videos = videoResponse.data.results;

              const trailer =
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
                );

              if (!trailer) {
                return null;
              }

              return {
                id: trailer.id,
                key: trailer.key,
                movieId: movie.id,
                movieTitle: movie.title,
                backdropPath: movie.backdrop_path,
                releaseDate: movie.release_date,
              };
            } catch (error) {
              console.error(
                `Error fetching trailer for ${movie.title}:`,
                error
              );

              return null;
            }
          })
        );

        setTrailers(
          trailersWithDetails
            .filter(Boolean)
            .slice(0, 8)
        );
      } catch (error) {
        console.error(
          "Error fetching featured trailers:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTrailers();
  }, []);

  const handlePlay = (trailerId) => {
    setPlayingTrailer(trailerId);
  };

  const getReleaseYear = (releaseDate) => {
    if (!releaseDate) {
      return "Coming soon";
    }

    return new Date(
      `${releaseDate}T00:00:00`
    ).getFullYear();
  };

  return (
    <section className="featured-trailers">
      <div className="container">
        <div className="featured-trailers-heading">
          <div>
            <p className="featured-trailers-eyebrow">
              Watch Now
            </p>

            <h2>Featured Trailers</h2>
          </div>

          <p className="featured-trailers-description">
            Preview some of the most popular movies people
            are watching right now.
          </p>
        </div>

        {loading ? (
          <div className="featured-trailers-loading">
            Loading trailers...
          </div>
        ) : trailers.length > 0 ? (
          <div className="featured-trailers-grid">
            {trailers.map((trailer) => (
              <article
                className="featured-trailer-card"
                key={trailer.id}
              >
                <div className="featured-trailer-media">
                  {playingTrailer === trailer.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                      title={`${trailer.movieTitle} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img
                        src={`${IMAGE_BASE_URL}/w780${trailer.backdropPath}`}
                        alt={`${trailer.movieTitle} trailer`}
                      />

                      <div className="featured-trailer-overlay"></div>

                      <button
                        type="button"
                        className="featured-trailer-play"
                        onClick={() =>
                          handlePlay(trailer.id)
                        }
                        aria-label={`Play ${trailer.movieTitle} trailer`}
                      >
                        <i className="fa-solid fa-play"></i>
                      </button>
                    </>
                  )}
                </div>

                <div className="featured-trailer-info">
                  <div>
                    <h3>{trailer.movieTitle}</h3>

                    <p>
                      {getReleaseYear(
                        trailer.releaseDate
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="featured-trailer-small-play"
                    onClick={() =>
                      handlePlay(trailer.id)
                    }
                    aria-label={`Play ${trailer.movieTitle} trailer`}
                  >
                    <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="featured-trailers-empty">
            No featured trailers are currently available.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedTrailer;