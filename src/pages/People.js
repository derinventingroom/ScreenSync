// src/pages/People.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/css/People.css"; 

const People = () => {
  const [people, setPeople] = useState([]);
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`
        );
        setPeople(response.data.results);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="people-page container py-4">
      <h2 className="mb-4 text-white">Trending People</h2>

      <div className="row">
        {people.map((person) => (
          <div
            className="col-6 col-md-4 col-lg-3 mb-4"
            key={person.id}
            onClick={() => navigate(`/people/${person.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="person-card bg-dark text-white rounded p-2 h-100 text-center">
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={person.name}
                className="img-fluid rounded mb-2"
              />
     
              <div className="person-info">
                <div className="info-flex">
                  <h5 className="person-name">{person.name}</h5>
                </div>
                {person.known_for_department && (
                  <p className="person-department">
                    {person.known_for_department}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
