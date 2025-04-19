import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (query) {
      const fetchMovies = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie`,
            {
              params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                query: query,
              },
            }
          );
          setMovies(response.data.results);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      };

      fetchMovies();
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      <ul>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <li key={movie.id}>
              <h2>{movie.title}</h2>
              <p>{movie.release_date}</p>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width="150"
              />
            </li>
          ))
        ) : (
          <p>No results found</p>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
