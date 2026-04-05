import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, House, BookText, Contact } from "lucide-react";
import "./usernav.css";

const UserNav = ({ handleLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="user-top-nav">

      {/* Mobile Hamburger Menu */}
      <button
        className="menu-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Logo */}
      <div className="nav-logo">
        <h3>ToOseA</h3>
      </div>

      {/* Desktop Navigation */}
      <div className={`navigation ${isOpen ? "active" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          onClick={() => setIsOpen(false)}
        >
          <House className="topnav-icons"/>
          Home
        </Link>

        <Link
          to="/about"
          className={`nav-link ${
            location.pathname.includes("/about") ? "active" : ""
          }`}
          onClick={() => setIsOpen(false)}
        >
          <BookText className="topnav-icons"/>
          About us
        </Link>

        <Link
          to="/contact"
          className={`nav-link ${
            location.pathname.includes("/contact") ? "active" : ""
          }`}
          onClick={() => setIsOpen(false)}
        >
          <Contact className="topnav-icons"/>
          Contact us
        </Link>

      </div>

    </nav>
  );
};

export default UserNav;
