import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HomeIcon,
  LogOutIcon,
  Box,
  ChevronUp,
  ChevronDownIcon,
  CalendarRange,
  Users,
} from "lucide-react";
import "./sidebar.css";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
}) => {
  const location = useLocation();

  // Logged-in user from Redux
  const { user } = useSelector((state) => state.user);

  // Current user's role
  const role = user?.role;

  const [roomsOpen, setRoomsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [apartmentsOpen, setApartmentsOpen] = useState(false);

  return (
    <div
      className={`sidebar admin-sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >
      <div className="sidebar-top">
        <div className="sidebar-logo-heading">
          <button
            type="button"
            className="menu-toggle"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ✕
          </button>

          <div className="sidebar-header">
            <h3>ToOseA</h3>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* ================= OWNER ================= */}
          {role === "OWNER" && (
            <>
              <Link
                to="/admin"
                className={`sidebar-link ${
                  location.pathname === "/admin"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              {/* STAFF */}
              <div className="dropdown">
                <button
                  onClick={() =>
                    setUsersOpen(!usersOpen)
                  }
                  className={`dropdown-button ${
                    location.pathname.includes(
                      "/admin/allusers"
                    ) ||
                    location.pathname.includes(
                      "/admin/createusers"
                    ) ||
                    location.pathname.includes(
                      "/admin/staff/"
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <Users className="icon" />
                  Staff

                  {usersOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {usersOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/admin/allusers"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/admin/allusers"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      View Staff
                    </Link>

                    <Link
                      to="/admin/createusers"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/admin/createusers"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      Create Staff
                    </Link>
                  </div>
                )}
              </div>

              {/* APARTMENTS */}
              <div className="dropdown">
                <button
                  onClick={() =>
                    setApartmentsOpen(
                      !apartmentsOpen
                    )
                  }
                  className={`dropdown-button ${
                    location.pathname.includes(
                      "/admin/apartment"
                    ) ||
                    location.pathname.includes(
                      "/admin/apartments"
                    ) ||
                    location.pathname.includes(
                      "/admin/apartmentsview"
                    )
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
                        location.pathname ===
                        "/admin/apartments"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      Create Apartment
                    </Link>

                    <Link
                      to="/admin/apartmentsview"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/admin/apartmentsview"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      View Apartments
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= RECEPTIONIST ================= */}
          {role === "RECEPTIONIST" && (
            <>
              <Link
                to="/receptionist"
                className={`sidebar-link ${
                  location.pathname ===
                  "/receptionist"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              <div className="dropdown">
                <button
                  onClick={() =>
                    setRoomsOpen(!roomsOpen)
                  }
                  className={`dropdown-button ${
                    location.pathname.includes(
                      "/receptionist/products"
                    )
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
                        location.pathname ===
                        "/receptionist/products/add"
                          ? "active"
                          : ""
                      }`}
                    >
                      Add Rooms
                    </Link>

                    <Link
                      to="/receptionist/products"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/receptionist/products"
                          ? "active"
                          : ""
                      }`}
                    >
                      Available Rooms
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= MANAGER ================= */}
          {role === "MANAGER" && (
            <>
              <Link
                to="/manager"
                className={`sidebar-link ${
                  location.pathname ===
                  "/manager"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              <Link
                to="/manager/bookings"
                className={`sidebar-link ${
                  location.pathname ===
                  "/manager/bookings"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <CalendarRange className="icon" />
                Bookings
              </Link>

              <Link
                to="/manager/apartments"
                className={`sidebar-link ${
                  location.pathname ===
                  "/manager/apartments"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <Box className="icon" />
                Apartments
              </Link>
            </>
          )}

          {/* ================= LOGOUT ================= */}
          <div className="sidebar-footer">
            <button
              onClick={handleLogout}
              className="logout-button"
            >
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