
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  House,
  BookText,
  Contact,
  DoorOpen,
  BriefcaseBusiness,
  Images,
} from "lucide-react";
import "./usenavv.css";

const UserNav = ({ handleLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <nav className="user-top-nav">
      <div className="nav-container">

        {/* LOGO */}
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu}>
            <h1>ToOseA</h1>
          </Link>
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          type="button"
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAVIGATION LINKS */}
        <div className={`navigation ${isOpen ? "active" : ""}`}>

          {/* HOME */}
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <House className="topnav-icons" />
            <span>Home</span>
          </Link>

          {/* ABOUT */}
          <Link
            to="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <BookText className="topnav-icons" />
            <span>About Us</span>
          </Link>

          {/* APARTMENTS */}
          <Link
            to="/rooms"
            className={`nav-link ${isActive("/rooms") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <DoorOpen className="topnav-icons" />
            <span>Apartments</span>
          </Link>

          {/* SERVICES */}
          <Link
            to="/services"
            className={`nav-link ${isActive("/services") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <BriefcaseBusiness className="topnav-icons" />
            <span>Services</span>
          </Link>

          {/* GALLERY */}
          <Link
            to="/gallery"
            className={`nav-link ${isActive("/gallery") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <Images className="topnav-icons" />
            <span>Gallery</span>
          </Link>

          {/* CONTACT */}
          <Link
            to="/contact"
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            onClick={closeMenu}
          >
            <Contact className="topnav-icons" />
            <span>Contact Us</span>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default UserNav;

