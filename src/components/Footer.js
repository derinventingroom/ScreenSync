// Footer.jsx
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} ScreenSync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
