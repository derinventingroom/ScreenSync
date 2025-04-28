import { useState, useEffect } from "react";
import axios from "axios";
import "../components/css/Shows.css"; 
import { useNavigate } from "react-router-dom";

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [category, setCategory] = useState("popular");
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
  const navigate = useNavigate();

  const getRegion = () => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const regionMatch = locale.match(/-([A-Z]{2})$/);
    return regionMatch ? regionMatch[1] : "US"; // fallback to US
  };
  
  const region = getRegion();
  

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${category}?api_key=${apiKey}&language=en-US&region=${region}&page=1`
        );
        setShows(response.data.results);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };

    fetchShows();
  }, [category, region]);

  return (
    <div className="shows-page container py-4">
      <h2 className="mb-4 text-white">TV Shows - {category.replace("_", " ")}</h2>

      {/* Filter Buttons */}
      <div className="btn-group mb-4" role="group">
        <button
          className={`btn btn-outline-light ${category === "popular" ? "active" : ""}`}
          onClick={() => setCategory("popular")}
        >
          Popular
        </button>
        <button
          className={`btn btn-outline-light ${category === "airing_today" ? "active" : ""}`}
          onClick={() => setCategory("airing_today")}
        >
          Airing Today
        </button>
        <button
          className={`btn btn-outline-light ${category === "on_the_air" ? "active" : ""}`}
          onClick={() => setCategory("on_the_air")}
        >
          On The Air
        </button>
      </div>

      {/* Show Grid */}
      <div className="row">
        {shows.map((show) => (
          <div
            className="col-6 col-md-4 col-lg-3 mb-4"
            key={show.id}
            onClick={() => navigate(`/shows/${show.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="show-card bg-dark text-white rounded p-2 h-100">
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="img-fluid rounded mb-2"
              />
              <div className="show-info">
                <div className="info-flex">
                  <i class="fa-solid fa-tv"></i>
                  <h5 className="show-title">{show.name}</h5>
                </div>
                 <p className="show-air-date">First Air Date: {show.first_air_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shows;
