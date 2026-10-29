import {
  MenuIcon,
  UserCircleIcon,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import "./header.css";

function Header({ setSidebarOpen }) {
  const user = useSelector((state) => state.user.user);

  // Get the first letter of the user's first name
  const userFirstLetter =
    user?.fullName
      ?.trim()
      .split(/\s+/)[0]
      ?.charAt(0)
      .toUpperCase();

  const location = useLocation();

  const getPageTitle = (pathname) => {
    /* ========================================
       OWNER
    ======================================== */

    if (pathname === "/admin")
      return "Dashboard";

    if (pathname.startsWith("/admin/allusers"))
      return "View Staff";

    if (pathname.startsWith("/admin/createusers"))
      return "Create Staff";

    if (pathname.startsWith("/admin/staff/"))
      return "Staff Details";

    if (pathname === "/admin/apartments")
      return "Create Apartment";

    if (
      pathname.startsWith("/admin/apartment/") &&
      pathname.endsWith("/images")
    )
      return "Apartment Images";

    if (pathname.startsWith("/admin/apartment/"))
      return "Apartment Details";

    if (pathname.startsWith("/admin/apartmentsview"))
      return "View Apartments";

    if (pathname.startsWith("/admin/monthly"))
      return "Monthly Bookings";

    if (pathname.startsWith("/admin/yearly"))
      return "Yearly Bookings";

    if (pathname.startsWith("/admin/pendingapprovals"))
      return "Pending Approvals";

    if (pathname.startsWith("/admin/allapprovals"))
      return "All Approvals";


    /* ========================================
       MANAGER
    ======================================== */

    if (pathname === "/manager")
      return "Dashboard";

    if (pathname === "/manager/createusers")
      return "Create Staff";

    if (pathname === "/manager/staff")
      return "View Staff";

    if (pathname === "/manager/apartments")
      return "Apartments";

    if (pathname === "/manager/apartments/create")
      return "Create Apartment";

    if (pathname.startsWith("/manager/bookings/today"))
      return "Today's Bookings";

    if (pathname.startsWith("/manager/bookings/month"))
      return "Monthly Bookings";


    /* ========================================
       RECEPTIONIST
    ======================================== */

    if (pathname === "/receptionist")
      return "Dashboard";

    if (pathname.startsWith("/receptionist/walkin"))
      return "Create Booking";

    if (pathname.startsWith("/receptionist/todaybookings"))
      return "Today's Bookings";

    if (pathname.startsWith("/receptionist/bookings/"))
      return "Booking Details";

    if (pathname.startsWith("/receptionist/checkedinguests"))
      return "Checked In Guests";

    if (pathname.startsWith("/receptionist/products"))
      return "Apartments";


    /* ========================================
       DEFAULT
    ======================================== */

    return "Dashboard";
  };

  const currentTitle = getPageTitle(location.pathname);

  return (
    <header className="header">

      {/* ========================================
          MOBILE SIDEBAR BUTTON
      ======================================== */}

      <button
        type="button"
        className="menu-toggle"
        onClick={() =>
          setSidebarOpen((prev) => !prev)
        }
        aria-label="Toggle sidebar"
        aria-expanded={false}
      >
        <MenuIcon className="icon" />
      </button>


      {/* ========================================
          HEADER CONTENT
      ======================================== */}

      <div className="header-content">

        <h1 className="header-title">
          {currentTitle}
        </h1>

        <div className="header-right">

          {/* ========================================
              PROFILE
          ======================================== */}

          <div className="profile-dropdown">
            <div className="profile-circle">
              {userFirstLetter || (
                <UserCircleIcon className="profile-icon" />
              )}
            </div>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;