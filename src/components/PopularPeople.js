import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/PopularPeople.css";

const API_KEY = "7ff29f44e328a4c9a0fd467d2c5afffa";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const PopularPeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPeople = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/person/popular`,
          {
            params: {
              api_key: API_KEY,
              language: "en-US",
              page: 1,
            },
          }
        );

        const filteredPeople = response.data.results
          .filter((person) => person.profile_path)
          .slice(0, 4);

        setPeople(filteredPeople);
      } catch (error) {
        console.error(
          "Error fetching popular people:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPeople();
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
    <section className="home-popular-people">
      <div className="container">
        <div className="home-people-heading">
          <div>
            <p className="home-people-eyebrow">
              Discover the Talent
            </p>

            <h2>Popular People</h2>
          </div>

          <Link
            to="/people"
            className="home-people-view-all"
          >
            View All People
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="popular-people-loading">
            Loading popular people...
          </div>
        ) : people.length > 0 ? (
          <div className="popular-people-grid">
            {people.map((person) => (
              <Link
                to={`/people/${person.id}`}
                className="popular-person-link"
                key={person.id}
              >
                <article className="popular-person-card">
                  <div className="popular-person-image-wrapper">
                    <img
                      src={`${IMAGE_BASE_URL}/w500${person.profile_path}`}
                      alt={person.name}
                      className="popular-person-image"
                    />

                    {person.known_for_department && (
                      <div className="popular-person-department">
                        {person.known_for_department}
                      </div>
                    )}

                    <div className="popular-person-hover-overlay">
                      <span>
                        View Profile
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>

                  <div className="popular-person-info">
                    <h3>{person.name}</h3>

                    <p>
                      {getKnownForTitles(person)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="popular-people-empty">
            No popular people are currently available.
          </p>
        )}
      </div>
    </section>
  );
};

export default PopularPeople;