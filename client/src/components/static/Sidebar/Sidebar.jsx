import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  LogOutIcon,
  Box,
  ChevronUp,
  ChevronDownIcon,
  CalendarRange,
  LibraryBig,
  Users
} from "lucide-react";
import "./sidebar.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const location = useLocation();

  const [roomsOpen, setRoomsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [apartmentsOpen, setApartmentsOpen] = useState(false);

  const getRoleFromPath = (path) => {
    if (path.startsWith("/admin")) return "admin";
    if (path.startsWith("/receptionist")) return "receptionist";
    if (path.startsWith("/manager")) return "manager";
    return "receptionist";
  };

  const role = getRoleFromPath(location.pathname);

  return (
    <div className={`sidebar admin-sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo-heading">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ✕
          </button>

          <div className="sidebar-header">
            <h3>ToOseA</h3>
          </div>
        </div>

        <nav className="sidebar-nav">

          {/* ================= ADMIN ================= */}
          {role === "admin" && (
            <>
              {/* Dashboard */}
              <Link
                to="/admin"
                className={`sidebar-link ${
                  location.pathname === "/admin" ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              {/* ================= USERS DROPDOWN ================= */}
              <div className="dropdown">
                <button
                  onClick={() => setUsersOpen(!usersOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/admin/users") ? "active" : ""
                  }`}
                >
                  <Users className="icon" />
                  Users
                  {usersOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {usersOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/admin/users"
                      className={`dropdown-link ${
                        location.pathname === "/admin/allusers"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      View Users
                    </Link>

                    <Link
                      to="/admin/createusers"
                      className={`dropdown-link ${
                        location.pathname === "/admin/users/create"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Create User
                    </Link>
                  </div>
                )}
              </div>

              {/* ================= APARTMENTS DROPDOWN ================= */}
              <div className="dropdown">
                <button
                  onClick={() => setApartmentsOpen(!apartmentsOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/admin/apartments")
                      ? "active"
                      : ""
                  }`}
                >
                  <Box className="icon" />
                  Apartments
                  {apartmentsOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {apartmentsOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/admin/apartments"
                      className={`dropdown-link ${
                        location.pathname === "/admin/apartments"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      View Apartments
                    </Link>

                    <Link
                      to="/admin/apartments/create"
                      className={`dropdown-link ${
                        location.pathname === "/admin/create-apartments"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Create Apartment
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= RECEPTIONIST ================= */}
          {role === "receptionist" && (
            <>
              <Link
                to="/receptionist"
                className={`sidebar-link ${
                  location.pathname === "/receptionist" ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              {/* Rooms Dropdown */}
              <div className="dropdown">
                <button
                  onClick={() => setRoomsOpen(!roomsOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/receptionist/products")
                      ? "active"
                      : ""
                  }`}
                >
                  <Box className="icon" />
                  Rooms
                  {roomsOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {roomsOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/receptionist/products/add"
                      className={`dropdown-link ${
                        location.pathname === "/receptionist/products/add"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Add Rooms
                    </Link>

                    <Link
                      to="/receptionist/products"
                      className={`dropdown-link ${
                        location.pathname === "/receptionist/products"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Available Rooms
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= MANAGER ================= */}
          {role === "manager" && (
            <>
              <Link
                to="/manager"
                className={`sidebar-link ${
                  location.pathname === "/manager" ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              <Link
                to="/manager/bookings"
                className={`sidebar-link ${
                  location.pathname === "/manager/bookings" ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <CalendarRange className="icon" />
                Bookings
              </Link>

              <Link
                to="/manager/apartments"
                className={`sidebar-link ${
                  location.pathname === "/manager/apartments" ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Box className="icon" />
                Apartments
              </Link>
            </>
          )}

          {/* ================= LOGOUT ================= */}
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <LogOutIcon className="icon" />
              Logout
            </button>
          </div>

        </nav>
      </div>
    </div>
  );
};

export default Sidebar;