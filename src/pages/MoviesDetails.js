import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/MoviesDetails.css";

const MovieDetails = () => {
  const { id } = useParams(); // get movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]); // Store the cast here
  const [trailer, setTrailer] = useState(""); // Store the trailer URL here
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
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
        setCast(castResponse.data.cast.slice(0, 8)); // Get the first 3 cast members

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

        const reviewsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`
        );
        setReviews(reviewsResponse.data.results.slice(0, 3));

      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div className="p-4">Loading...</div>;

  return (
    <div className="movie-detail container">
      <div 
         className="movie-top"
         style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
         >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster img-fluid mb-3"
        />
        <div className="movie-data">
          <h2>{movie.title}</h2>
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
          </div>
        </div>

      {/* Reviews Section */}
     <div className="reviews-section">
      {/* Cast Section */}
       <div className="cast-list">
        <h2>Cast</h2>
        <div className="d-flex gap-3">
          {cast.map((actor) => (
            <Link
              to={`/people/${actor.id}`}
              key={actor.id}
              className="cast-link"
            >
            <div className="cast-card">
              <img
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                className="img-fluid"
              />
              <p>{actor.name}</p>
              <p className="text-muted">{actor.character}</p>
             </div>
            </Link>
          ))}
        </div>
      </div>
      <hr></hr>
      <h2>Reviews</h2>
      {/* <div className="reviews-between mt-4"></div> */}
      {reviews.length > 0 ? (
            reviews.map((review) => (
              review.content && (
                <div key={review.id} className="review mb-3">
                  <p><strong>{review.author}</strong></p>
                  <p>
                    {expandedReviews[review.id]
                      ? review.content
                      : `${review.content.substring(0, 300)}...`}
                  </p>
                  {review.content.length > 300 && (
                    <button
                      className="read-more-btn"
                      onClick={() =>
                        setExpandedReviews((prev) => ({
                          ...prev,
                          [review.id]: !prev[review.id],
                        }))
                      }
                    >
                      {expandedReviews[review.id] ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              )
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
    </div>
  );
};

export default MovieDetails;
