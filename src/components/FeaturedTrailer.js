import { useState, useEffect } from "react";
import axios from "axios";
import "./css/FeaturedTrailer.css";

const FeaturedTrailer = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa"; 
  const baseURL = "https://api.themoviedb.org/3";
  const imageBaseURL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
        );
        const movie = response.data.results[0];
        if (movie?.id) {
          const videoResponse = await axios.get(
            `${baseURL}/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`
          );
          const officialTrailers = videoResponse.data.results.filter(
            (video) => video.type === "Trailer"
          );
          if (officialTrailers.length > 0) {
            const trailersWithPosters = officialTrailers.map((trailer) => ({
              ...trailer,
              backdrop_path: movie.backdrop_path,
            }));
            const shuffledTrailers = trailersWithPosters.sort(() => Math.random() - 0.5);
            setSelectedVideo(shuffledTrailers[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching trailers:", error);
      }
    };

    fetchTrailers();
  }, []);

  const handlePlayClick = () => {
    setShowPlayer(true);
  };

  return (
    <div className="featured-section">
      <div className="container">
        <h2>Featured Trailer</h2>
        {!showPlayer && selectedVideo ? (
          <div className="featured-video-thumbnail" onClick={handlePlayClick}>
            <img
              src={`https://image.tmdb.org/t/p/w1280/${selectedVideo.backdrop_path}`}
              alt={selectedVideo.name}
              className="featured-backdrop-image"
            />
            <div className="play-button-overlay">
              <i className="fas fa-play play-button"></i> {/* Play Icon */}
            </div>
          </div>
        ) : (
          <div className="featured-video">
            {selectedVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                title={selectedVideo.name}
                allowFullScreen
              ></iframe>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedTrailer;
