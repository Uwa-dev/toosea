import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>ToOseA Garden</h2>
          <p>
            Your comfort, our priority.
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
          <p>📍 Ajayi Apata Estate, beside Fara Park Estate, Sangotedo, Ajah, Lagos</p>
          <p>📞 +2348081557777</p>
          <p>✉️ tooseagarden@gmail.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ToOseA Garden. All Rights Reserved.</p>
      </div>
    </footer>
  );
}