import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/ShowDetails.css";

const ShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const showResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
        );
        setShow(showResponse.data);

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-US`
        );
        setCast(castResponse.data.cast.slice(0, 8));

        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailerData = trailerResponse.data.results.find(
          (video) => video.type === "Trailer"
        );
        if (trailerData) {
          setTrailer(`https://www.youtube.com/watch?v=${trailerData.key}`);
        }

        const reviewsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`
        );
        setReviews(reviewsResponse.data.results.slice(0, 3));
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    };

    fetchShow();
  }, [id]);

  if (!show) return <div className="p-4">Loading...</div>;

  return (
    <div className="show-detail">
      <div
        className="show-top"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
          className="show-poster img-fluid mb-3"
        />
        <div className="show-data container">
          <h2>{show.name}</h2>
          <p><strong>First Air Date:</strong> {show.first_air_date}</p>
          <p><strong>Overview:</strong> {show.overview}</p>
          <p><strong>Rating:</strong> {show.vote_average} / 10</p>

          {trailer && (
            <div className="mt-4">
              <a href={trailer} target="_blank" rel="noopener noreferrer">
                <button className="btn">Watch Trailer</button>
              </a>
            </div>
          )}
        </div>
      </div>
      <div>
      {/* Cast Section */}
      <div className="cast-list">
        <h2 className="container">Cast</h2>
        <div className="d-flex gap-3">
          {cast.map((actor) => (
            <Link to={`/people/${actor.id}`} key={actor.id} className="cast-link">
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

      <hr />

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) =>
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
          )
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ShowDetails;
