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
  CheckCircle,
  CalendarDays,
  LogIn,
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
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

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

              {/* APPROVALS */}
              <div className="dropdown">
                <button
                  onClick={() => setApprovalsOpen(!approvalsOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/admin/pendingapprovals") ||
                    location.pathname.includes("/admin/allapprovals")
                      ? "active"
                      : ""
                  }`}
                >
                  <CheckCircle className="icon" />
                  Approvals

                  {approvalsOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {approvalsOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/admin/pendingapprovals"
                      className={`dropdown-link ${
                        location.pathname === "/admin/pendingapprovals"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Pending Approvals
                    </Link>

                    <Link
                      to="/admin/allapprovals"
                      className={`dropdown-link ${
                        location.pathname === "/admin/allapprovals"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      All Approvals
                    </Link>
                  </div>
                )}
              </div>

              {/* BOOKINGS */}
              <div className="dropdown">
                <button
                  onClick={() => setBookingsOpen(!bookingsOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/admin/monthbookings") ||
                    location.pathname.includes("/admin/yearbookings")
                      ? "active"
                      : ""
                  }`}
                >
                  <CalendarDays className="icon" />
                  Bookings

                  {bookingsOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {bookingsOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/admin/monthbookings"
                      className={`dropdown-link ${
                        location.pathname === "/admin/monthbookings"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      This Month
                    </Link>

                    <Link
                      to="/admin/yearbookings"
                      className={`dropdown-link ${
                        location.pathname === "/admin/yearbookings"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      This Year
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
                  Apartments

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
                      Add Apartments
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
                      Available Apartments
                    </Link>
                  </div>
                )}
              </div>

              {/* BOOKINGS */}
              <div className="dropdown">
                <button
                  onClick={() => setBookingOpen(!bookingOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/receptionist/walkin") ||
                    location.pathname.includes("/receptionist/todaybookings")
                      ? "active"
                      : ""
                  }`}
                >
                  <CalendarDays className="icon" />
                  Bookings

                  {bookingOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {bookingOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/receptionist/walkin"
                      className={`dropdown-link ${
                        location.pathname === "/receptionist/walkin"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Walk-in Booking
                    </Link>

                    <Link
                      to="/receptionist/todaybookings"
                      className={`dropdown-link ${
                        location.pathname === "/receptionist/todaybookings"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Today's Bookings
                    </Link>
                  </div>
                )}
              </div>

              {/* CHECK-IN */}
              <div className="dropdown">
                <button
                  onClick={() => setCheckInOpen(!checkInOpen)}
                  className={`dropdown-button ${
                    location.pathname.includes("/receptionist/checkin") ||
                    location.pathname.includes("/receptionist/checkedinguests")
                      ? "active"
                      : ""
                  }`}
                >
                  <LogIn className="icon" />
                  Check-in

                  {checkInOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {checkInOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/receptionist/checkin"
                      className={`dropdown-link ${
                        location.pathname === "/receptionist/checkin"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Today's Check-ins
                    </Link>

                    <Link
                      to="/receptionist/checkedinguests"
                      className={`dropdown-link ${
                        location.pathname === "/receptionist/checkedinguests"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      Checked-in Guests
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

              <div>Staff</div>

              <div>Apartment</div>
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