import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/PopularPeople.css";

const PopularPeople = () => {
    const [people, setPeople] = useState([]);
    const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
    const baseURL = "https://api.themoviedb.org/3";
    const imageBaseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchPopularPeople = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/person/popular?api_key=${apiKey}&language=en-US&page=1`
                );
                setPeople(
                    response.data.results
                        .filter((person) => person.profile_path)
                        .slice(0, 4)
                );
            } catch (error) {
                console.error("Error fetching popular people:");
            }
        };
        fetchPopularPeople();
    }, []);

    return (
        <div className="popular-people">
            <div className="container">
                <h2 className="section-title">Popular People</h2>
                <div className="d-flex justify-content-around flex-wrap">
                    {people.map((person) => (
                        <div className="col-lg-3" key={person.id}>
                            <Link to={`/person/${person.id}`} className="tv-link">
                                <div className="popular-person-item">
                                    <div className="person-item-background">
                                        <img
                                            src={`${imageBaseURL}${person.profile_path}`}
                                            className="img-fluid"
                                            alt={person.name}
                                        />
                                        <div className="block-description">
                                            <p>{person.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularPeople;
