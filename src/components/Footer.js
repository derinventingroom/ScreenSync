import { Link } from "react-router-dom";
import "./css/Footer.css";
import logo from "../assets/images/logo.png";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-content">

                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                       <img src={logo} alt="ScreenSync Logo" />
                    </Link>

                    <p>
                        Discover trending movies, TV shows, and actors
                        powered by the TMDB API.
                    </p>
                </div>

                <div className="footer-links">

                    <div>
                        <h4>Browse</h4>

                        <Link to="/movies">Movies</Link>
                        <Link to="/shows">TV Shows</Link>
                        <Link to="/people">People</Link>
                    </div>

                    <div>
                        <h4>About</h4>

                        <a
                            href="https://www.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            TMDB
                        </a>

                        <a
                            href="https://developer.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            API
                        </a>
                    </div>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © {year} ScreenSync • Built with React & TMDB API
                </p>

            </div>
        </footer>
    );
};

export default Footer;