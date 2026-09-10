
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

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

  <p>
    <MapPin size={18} />
    Ajayi Apata Estate, beside Fara Park Estate, Sangotedo, Ajah, Lagos
  </p>

  <p>
    <Phone size={18} />
    +2348081557777
  </p>

  <p>
    <Mail size={18} />
    tooseagarden@gmail.com
  </p>
</div>



        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>

          <a href="#" target="_blank" rel="noopener noreferrer">
             Instagram: ToOseA Gardens
          </a>

          <a href="#" target="_blank" rel="noopener noreferrer">
             Facebook: Toosea Garden
          </a>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} ToOseA Garden. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
