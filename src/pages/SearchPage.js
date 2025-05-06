import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);
  const apiKey = "7ff29f44e328a4c9a0fd467d2c5afffa";

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${query}`
        );
        setResults(res.data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Search Results for "{query}"</h2>
      <div className="row">
        {results.length === 0 && <p>No results found.</p>}
        {results.map((item) => {
          let link = "#";
          let title = "";
          let image = "";

          if (item.media_type === "movie") {
            link = `/movies/${item.id}`;
            title = item.title;
            image = item.poster_path;
          } else if (item.media_type === "tv") {
            link = `/shows/${item.id}`;
            title = item.name;
            image = item.poster_path;
          } else if (item.media_type === "person") {
            link = `/people/${item.id}`;
            title = item.name;
            image = item.profile_path;
          } else {
            return null; // unknown type
          }

          return (
            <div className="col-md-3 mb-4" key={item.id}>
              <Link to={link} className="text-decoration-none">
                <div className="card h-100">
                  {image && (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${image}`}
                      className="card-img-top"
                      alt={title}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="text-muted">{item.media_type.toUpperCase()}</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
