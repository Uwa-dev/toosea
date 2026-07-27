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

  const [usersOpen, setUsersOpen] = useState(false);
  const [apartmentsOpen, setApartmentsOpen] = useState(false);
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [managerBookingsOpen, setManagerBookingsOpen] = useState(false);
  const [managerApartmentsOpen, setManagerApartmentsOpen] = useState(false);
  const [managerStaffOpen, setManagerStaffOpen] = useState(false);

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

              {/* APARTMENTS  */}
              <Link
                to="/receptionist/products"
                className={`sidebar-link ${
                  location.pathname ===
                  "/receptionist/products"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <HomeIcon className="icon" />
                Apartments
              </Link>

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
              <Link
                to="/receptionist/checkedinguests"
                className={`sidebar-link ${
                  location.pathname ===
                  "/receptionist/checkedinguests"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <HomeIcon className="icon" />
                Checked-in Guests
              </Link>              
            </>
          )}

          {/* ================= MANAGER ================= */}
          {role === "MANAGER" && (
            <>
              <Link
                to="/manager"
                className={`sidebar-link ${
                  location.pathname === "/manager"
                    ? "active"
                    : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <HomeIcon className="icon" />
                Dashboard
              </Link>

              {/* BOOKINGS */}
              <div className="dropdown">
                <button
                  onClick={() =>
                    setManagerBookingsOpen(
                      !managerBookingsOpen
                    )
                  }
                  className={`dropdown-button ${
                    location.pathname.includes(
                      "/manager/bookings"
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <CalendarRange className="icon" />
                  Bookings

                  {managerBookingsOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {managerBookingsOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/manager/bookings/today"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/manager/bookings/today"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      Today's Bookings
                    </Link>

                    <Link
                      to="/manager/bookings/month"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/manager/bookings/month"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      Monthly Bookings
                    </Link>
                  </div>
                )}
              </div>

              {/* APARTMENTS */}
              <div className="dropdown">
                <button
                  onClick={() =>
                    setManagerApartmentsOpen(
                      !managerApartmentsOpen
                    )
                  }
                  className={`dropdown-button ${
                    location.pathname.includes(
                      "/manager/apartments"
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <Box className="icon" />
                  Apartments

                  {managerApartmentsOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {managerApartmentsOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/manager/apartments"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/manager/apartments"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      View Apartments
                    </Link>

                    <Link
                      to="/manager/apartments/create"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/manager/apartments/create"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      Create Apartment
                    </Link>
                  </div>
                )}
              </div>

              {/* STAFF */}
              <div className="dropdown">
                <button
                  onClick={() =>
                    setManagerStaffOpen(
                      !managerStaffOpen
                    )
                  }
                  className={`dropdown-button ${
                    location.pathname.includes(
                      "/manager/staff"
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <Users className="icon" />
                  Staff

                  {managerStaffOpen ? (
                    <ChevronUp className="dropdown-icon" />
                  ) : (
                    <ChevronDownIcon className="dropdown-icon" />
                  )}
                </button>

                {managerStaffOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/manager/staff"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/manager/staff"
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
                      to="/manager/staff/create"
                      className={`dropdown-link ${
                        location.pathname ===
                        "/manager/staff/create"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                    >
                      Create Receptionist
                    </Link>
                  </div>
                )}
              </div>
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