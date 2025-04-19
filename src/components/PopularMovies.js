import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/PopularMovies.css";


const PopularMovies = () => {
    const [movies, setMovies] = useState([]);
    const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";
    const baseURL = "https://api.themoviedb.org/3";
    const imageBaseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try{
                const response = await axios.get(
                  `${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`
                );
                setMovies(
                    response.data.results
                      .filter((movie) => movie.poster_path) // removes null posters
                      .slice(0, 4)
                  );
            } catch (error) {
                console.error("Error fetching popular movies:", error);
            }
        };
        fetchPopularMovies();
    }, []);
            

    return(
      <div className="popular-movies">
        <div className="container">
                 <h2 className="section-title">Popular Movies</h2>
             
         <div className="d-flex justify-content-around flex-wrap">
         {movies.map((movie) => (
          <div className="col-lg-3" key={movie.id}>
            <Link to={`/movie/${movie.id}`} className="movie-link">
            <div className="popular-movie-item">
              <div className="movie-item-background">
                <img
                  src={`${imageBaseURL}${movie.poster_path}`}
                  className="img-fluid"
                  alt={movie.title}
                />
                <div className="block-description">
                   <p>{movie.title}</p>
                   <p>{movie.release_date}</p>
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

export default PopularMovies;