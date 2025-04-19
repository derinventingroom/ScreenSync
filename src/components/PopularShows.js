import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/PopularShows.css";

const PopularShows = () => {
    const [shows, setShows] = useState([]);
    const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
    const baseURL = "https://api.themoviedb.org/3";
    const imageBaseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchPoularShows = async () => {
            try{
                const response = await axios.get(
                    `${baseURL}/tv/popular?api_key=${apiKey}&language=en-US&page=1`
                );
                setShows(
                    response.data.results.filter((show) => show.poster_path)
                    .slice(0, 4)
                );
            } catch (error) {
                console.error("Error fethcing popular movies:");
            }
        };
        fetchPoularShows();
    }, []); 


return(
    <div className="popular-shows">
        <div className="container">
        <h2 className="section-title">Popular TV Shows</h2>
        <div className="d-flex justify-content-around flex-wrap">
            {shows.map((show) => (
                <div className="col-lg-3" key={show.id}>
                <Link to={`/tv/${show.id}`} className="tv-link">
                <div className="popular-show-item">
                  <div className="show-item-background">
                    <img
                    src={`${imageBaseURL}${show.poster_path}`}
                    className="img-fluid"
                    alt={show.name}
                    />
                    <div className="block-description">
                        <p>{show.name}</p>
                        <p>{show.first_air_date}</p>
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

}

export default PopularShows;
