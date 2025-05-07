// src/pages/PersonDetails.jsx
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../components/css/PeopleDetails.css";
import axios from "axios";

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const [personRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=en-US`)
        ]);

        setPerson(personRes.data);
        setCredits(creditsRes.data.cast.slice(0, 10)); // top 10 known-for
      } catch (err) {
        console.error("Failed to fetch person details:", err);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (!person) return <div className="">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4 mb-4">
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={person.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-8">
          <h2>{person.name}</h2>
          {person.birthday && <p><strong>Born:</strong> {person.birthday}</p>}
          {person.place_of_birth && <p><strong>Place of Birth:</strong> {person.place_of_birth}</p>}
          {person.biography && <p className="mt-3">{person.biography}</p>}
          <h3 className="mt-5 mb-3">Known For</h3>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
      >
      {credits.map((credit) => (
         <SwiperSlide key={credit.id}>
            <Link
              to={
                credit.media_type === "movie"
                  ? `/movies/${credit.id}`
                  : `/shows/${credit.id}`
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="credits-card">
                <img
                  src={
                    credit.poster_path
                      ? `https://image.tmdb.org/t/p/w500${credit.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={credit.title || credit.name}
                  className="img-fluid rounded mb-2"
                />
                <div className="credits-info">
                  <h6>{credit.title || credit.name}</h6>
                  <small>{credit.media_type === "movie" ? "Movie" : "TV"}</small>
                </div>
              </div>
            </Link>
          </SwiperSlide>
         ))}
         </Swiper>
        </div>
      </div>

      {/* Known For Section */}

   </div>
  );
};

export default PersonDetails;
