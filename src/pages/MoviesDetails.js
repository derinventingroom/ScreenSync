import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/MoviesDetails.css";

const MovieDetails = () => {
  const { id } = useParams(); // get movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]); // Store the cast here
  const [trailer, setTrailer] = useState(""); // Store the trailer URL here
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        setMovie(movieResponse.data);

        // Fetch cast members
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`
        );
        setCast(castResponse.data.cast.slice(0, 3)); // Get the first 3 cast members

        // Fetch the trailer
        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailerData = trailerResponse.data.results.find(
          (video) => video.type === "Trailer"
        );
        if (trailerData) {
          setTrailer(`https://www.youtube.com/watch?v=${trailerData.key}`);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div className="p-4">Loading...</div>;

  return (
    <div className="movie-detail container py-4">
      <div>
        <h2>{movie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="img-fluid mb-3"
        />
      </div>
      <div className="movie-data">
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Rating:</strong> {movie.vote_average} / 10</p>

      
      {/* Trailer Section */}
      {trailer && (
        <div className="mt-4">
          <a href={trailer} target="_blank" rel="noopener noreferrer">
            <button className="btn">Watch Trailer</button>
          </a>
        </div>
      )}

      {/* Cast Section */}
      <div className="mt-4">
        <h4>Cast</h4>
        <div className="d-flex">
          {cast.map((actor) => (
            <div key={actor.id} className="me-3">
              <img
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                className="img-fluid"
              />
              <p>{actor.name}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default MovieDetails;
