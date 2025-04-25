import { useState, useEffect } from "react";
import axios from "axios";
import "./css/FeaturedTrailer.css";

const FeaturedTrailer = () => {
  const [trailers, setTrailers] = useState([]);
  const [playingTrailer, setPlayingTrailer] = useState(null);
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
  const baseURL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchFeaturedTrailers = async () => {
      try {
        const movieResponse = await axios.get(
          `${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        const popularMovies = movieResponse.data.results.slice(0, 8);

        const trailersWithDetails = await Promise.all(
          popularMovies.map(async (movie) => {
            const videoResponse = await axios.get(
              `${baseURL}/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`
            );
            const trailer = videoResponse.data.results.find(
              (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            );

            return trailer
              ? {
                  id: trailer.id,
                  key: trailer.key,
                  movieTitle: movie.title,
                  backdropPath: movie.backdrop_path,
                }
              : null;
          })
        );

        setTrailers(trailersWithDetails.filter((trailer) => trailer !== null));
      } catch (error) {
        console.error("Error fetching featured trailers:", error);
      }
    };

    fetchFeaturedTrailers();
  }, []);

  const handlePlay = (trailerId) => {
    setPlayingTrailer(trailerId);
  };

  return (
<div className="featured-trailers">
  <div className="container">
    <h2 className="section-title">Featured Trailers</h2>
    <div className="row g-4">
      {trailers.map((trailer) => (
        <div className="col-lg-3" key={trailer.id}>
          <div className="trailer-item-wrapper">
            <div className="featured-trailer-item">
              <div className="trailer-item-background position-relative">
                {playingTrailer === trailer.id ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                    title={trailer.movieTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${trailer.backdropPath}`}
                      className="img-fluid"
                      alt={trailer.movieTitle}
                    />
                    <div
                      className="play-icon-wrapper"
                      onClick={() => handlePlay(trailer.id)}
                    >
                      <i className="fas fa-play play-icon"></i>
                    </div>
                  </>
                )}
                <div className="block-description">
                  <p>{trailer.movieTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};

export default FeaturedTrailer;
