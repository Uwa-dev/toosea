import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>Radisson Blu Ikeja</h2>
          <p>
            Luxury comfort, premium service, and unforgettable stays in the heart of Lagos.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📍 38-40 Isaac John St, Ikeja</p>
          <p>📞 0201 466 2390</p>
          <p>✉️ info@radissonikeja.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Radisson Blu Ikeja. All Rights Reserved.</p>
      </div>
    </footer>
  );
}