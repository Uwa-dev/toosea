import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  House,
  BookText,
  Contact,
  DoorOpen
} from "lucide-react";
import "./usenavv.css";


const UserNav = ({ handleLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="user-top-nav">
      
      {/* Mobile Hamburger Menu */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Logo */}
      <div className="nav-logo">
        <h3>ToOseA</h3>
      </div>

      {/* Navigation Links */}
      <div className={`navigation ${isOpen ? "active" : ""}`}>

        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          onClick={closeMenu}
        >
          <House className="topnav-icons" />
          Home
        </Link>

        <Link
          to="/about"
          className={`nav-link ${
            location.pathname.includes("/about") ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          <BookText className="topnav-icons" />
          About Us
        </Link>

     


        <Link
          to="/rooms"
          className={`nav-link ${
            location.pathname.includes("/rooms") ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          <DoorOpen className="topnav-icons" />
          Apartments
        </Link>

        <Link
          to="/contact"
          className={`nav-link ${
            location.pathname.includes("/contact") ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          <Contact className="topnav-icons" />
          Contact Us
        </Link>

        
        <Link
          to="/services"
          className={`nav-link ${
            location.pathname.includes("/services") ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          <DoorOpen className="topnav-icons" />
          Services
        </Link>

         <Link
          to="/gallery"
          className={`nav-link ${
            location.pathname.includes("/gallery") ? "active" : ""
          }`}
          onClick={closeMenu}
        >
          <DoorOpen className="topnav-icons" />
          Gallery
        </Link>


        

      </div>
    </nav>
  );
};

export default UserNav;