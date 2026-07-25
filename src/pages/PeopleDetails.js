// src/pages/PersonDetails.jsx

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../components/css/PeopleDetails.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const PersonDetails = () => {
  const { id } = useParams();

  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [showFullBiography, setShowFullBiography] = useState(false);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const [personRes, creditsRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`
          ),
          axios.get(
            `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`
          ),
        ]);

        setPerson(personRes.data);
        setCredits(creditsRes.data.cast || []);
      } catch (error) {
        console.error("Failed to fetch person details:", error);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (!person) {
    return <div className="person-loading">Loading...</div>;
  }

  const calculateAge = (birthday, deathday) => {
    if (!birthday) return null;

    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();

    let age = endDate.getFullYear() - birthDate.getFullYear();

    const hasNotHadBirthday =
      endDate.getMonth() < birthDate.getMonth() ||
      (endDate.getMonth() === birthDate.getMonth() &&
        endDate.getDate() < birthDate.getDate());

    if (hasNotHadBirthday) {
      age -= 1;
    }

    return age;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCreditDate = (credit) => {
    return credit.release_date || credit.first_air_date || "";
  };

  const getCreditYear = (credit) => {
    const date = getCreditDate(credit);

    return date ? new Date(`${date}T00:00:00`).getFullYear() : "TBA";
  };

  /*
   * Remove credits without posters, sort by popularity,
   * and use the first 10 for the Known For carousel.
   */
  const knownForCredits = [...credits]
    .filter((credit) => credit.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);

  /*
   * Sort the entire filmography from newest to oldest.
   */
  const filmography = [...credits].sort((a, b) => {
    const dateA = getCreditDate(a);
    const dateB = getCreditDate(b);

    if (!dateA) return 1;
    if (!dateB) return -1;

    return new Date(dateB) - new Date(dateA);
  });

  const biographyLimit = 700;

  const displayedBiography =
    person.biography?.length > biographyLimit && !showFullBiography
      ? `${person.biography.substring(0, biographyLimit)}...`
      : person.biography;

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <main className="person-detail">
      {/* Profile hero */}
      <section className="person-hero">
        <div className="container">
          <div className="person-hero-grid">
            <div className="person-image-column">
              <img
                src={
                  person.profile_path
                    ? `${IMAGE_BASE_URL}/w500${person.profile_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={person.name}
                className="person-profile-image"
              />
            </div>

            <div className="person-information">
              <p className="person-department">
                {person.known_for_department}
              </p>

              <h1>{person.name}</h1>

              <div className="person-facts">
                {person.birthday && (
                  <div className="person-fact">
                    <span className="person-fact-label">Born</span>

                    <span>
                      {formatDate(person.birthday)}
                      {age !== null && !person.deathday && ` · Age ${age}`}
                    </span>
                  </div>
                )}

                {person.deathday && (
                  <div className="person-fact">
                    <span className="person-fact-label">Died</span>

                    <span>
                      {formatDate(person.deathday)} · Age {age}
                    </span>
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="person-fact">
                    <span className="person-fact-label">
                      Place of Birth
                    </span>

                    <span>{person.place_of_birth}</span>
                  </div>
                )}
              </div>

              <div className="person-biography">
                <h2>Biography</h2>

                {person.biography ? (
                  <>
                    <p>{displayedBiography}</p>

                    {person.biography.length > biographyLimit && (
                      <button
                        type="button"
                        className="biography-toggle"
                        onClick={() =>
                          setShowFullBiography((previous) => !previous)
                        }
                      >
                        {showFullBiography
                          ? "Show Less"
                          : "Read Full Biography"}
                      </button>
                    )}
                  </>
                ) : (
                  <p>No biography is currently available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Known For */}
      {knownForCredits.length > 0 && (
        <section className="known-for-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Selected Work</p>
                <h2>Known For</h2>
              </div>
            </div>

            <Swiper
              className="known-for-swiper"
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1.35}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                480: {
                  slidesPerView: 2.2,
                },
                768: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
              }}
            >
              {knownForCredits.map((credit, index) => (
                <SwiperSlide
                  key={`${credit.media_type}-${credit.id}-${index}`}
                >
                  <Link
                    to={
                      credit.media_type === "movie"
                        ? `/movies/${credit.id}`
                        : `/shows/${credit.id}`
                    }
                    className="credit-link"
                  >
                    <article className="credits-card">
                      <img
                        src={`${IMAGE_BASE_URL}/w500${credit.poster_path}`}
                        alt={credit.title || credit.name}
                      />

                      <div className="credits-info">
                        <h3>{credit.title || credit.name}</h3>

                        <div className="credit-meta">
                          <span>
                            {credit.media_type === "movie"
                              ? "Movie"
                              : "TV Show"}
                          </span>

                          <span>{getCreditYear(credit)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Filmography */}
      {filmography.length > 0 && (
        <section className="filmography-section">
          <div className="container">
            <div className="section-heading filmography-heading">
              <div>
                <p className="section-eyebrow">Credits</p>
                <h2>Filmography</h2>
              </div>
            </div>

            <div className="filmography-list">
              {filmography.map((credit, index) => (
                <Link
                  key={`${credit.media_type}-${credit.id}-${index}`}
                  to={
                    credit.media_type === "movie"
                      ? `/movies/${credit.id}`
                      : `/shows/${credit.id}`
                  }
                  className="filmography-item"
                >
                  <span className="filmography-year">
                    {getCreditYear(credit)}
                  </span>

                  <div className="filmography-title">
                    <h3>{credit.title || credit.name}</h3>

                    {credit.character && (
                      <p>as {credit.character}</p>
                    )}
                  </div>

                  <span className="filmography-type">
                    {credit.media_type === "movie"
                      ? "Movie"
                      : "TV Show"}
                  </span>

                  <i
                    className="fa-solid fa-chevron-right"
                    aria-hidden="true"
                  ></i>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default PersonDetails;