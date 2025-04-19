import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "./css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Logo */}
      <Link className="navbar-brand" to="/">
        ScreenSync
      </Link>

      {/* Toggle Button for Mobile View */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Content */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="d-flex w-100 align-items-center">
          {/* Center SearchBar with flex-grow */}
          <div className="search-bar flex-grow-1 mx-3">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/movies">Movies</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tv-shows">TV Shows</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/people">People</Link>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
