import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../components/css/ShowDetails.css";

const ShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const showRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
        );
        setShow(showRes.data);

        const castRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-US`
        );
        setCast(castRes.data.cast.slice(0, 3));

        const videoRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailerVideo = videoRes.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailer(trailerVideo);
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    };

    fetchShowDetails();
  }, [id]);

  if (!show) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="container py-4 text-white">
      <div className="row">
        <div className="col-md-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-8">
          <h2>{show.name}</h2>
          <p><strong>First Air Date:</strong> {show.first_air_date}</p>
          <p>{show.overview}</p>

          <h5 className="mt-4">Top Cast</h5>
          <ul>
            {cast.map((member) => (
              <li key={member.id}>
                {member.name} as {member.character}
              </li>
            ))}
          </ul>

          {trailer && (
            <div className="mt-4">
              <h5>Trailer</h5>
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
