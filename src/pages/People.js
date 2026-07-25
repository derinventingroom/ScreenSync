// src/pages/People.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/css/People.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);

        let allResults = [];

        for (let page = 1; page <= 3; page++) {
          const response = await axios.get(
            `${BASE_URL}/person/popular`,
            {
              params: {
                api_key: API_KEY,
                language: "en-US",
                page,
              },
            }
          );

          allResults = [...allResults, ...response.data.results];
        }

        setPeople(allResults);
      } catch (error) {
        console.error("Error fetching people:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const getKnownForTitles = (person) => {
    if (!person.known_for?.length) {
      return "Credits unavailable";
    }

    return person.known_for
      .slice(0, 2)
      .map((credit) => credit.title || credit.name)
      .filter(Boolean)
      .join(" • ");
  };

  return (
    <main className="people-page">
      <section className="people-header">
        <div className="container">
          <p className="people-eyebrow">Discover the Talent</p>
          <h1>Popular People</h1>
          <p className="people-header-description">
            Explore actors, directors, writers, and other popular
            entertainment professionals.
          </p>
        </div>
      </section>

      <section className="people-grid-section">
        <div className="container">
          {loading ? (
            <div className="people-loading">
              Loading people...
            </div>
          ) : (
            <div className="people-grid">
              {people.map((person) => (
                <Link
                  to={`/people/${person.id}`}
                  className="person-card-link"
                  key={person.id}
                >
                  <article className="person-card">
                    <div className="person-image-container">
                      <img
                        src={
                          person.profile_path
                            ? `${IMAGE_BASE_URL}/w500${person.profile_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={person.name}
                        className="person-image"
                      />

                      {person.known_for_department && (
                        <div className="person-department-badge">
                          {person.known_for_department}
                        </div>
                      )}
                    </div>

                    <div className="person-info">
                      <h2 className="person-name">
                        {person.name}
                      </h2>

                      <p className="person-known-for">
                        {getKnownForTitles(person)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default People;