import { BellIcon, MenuIcon, UserCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import './header.css';

function Header({ setSidebarOpen }) {
  const user = useSelector((state) => state.user.user);
  const userFirstLetter = user?.username?.charAt(0).toUpperCase();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    // ================= OWNER =================
    if (pathname === "/admin") return "Dashboard";

    if (pathname.startsWith("/admin/allusers"))
      return "View Staff";

    if (pathname.startsWith("/admin/createusers"))
      return "Create Staff";

    if (pathname.startsWith("/admin/staff/"))
      return "Staff Details";

    if (pathname.startsWith("/admin/apartmentsview"))
      return "View Apartments";

    if (pathname.startsWith("/admin/apartments"))
      return "Create Apartment";

    if (pathname.startsWith("/admin/apartment/"))
      return "Apartment Details";

    // ================= MANAGER =================
    if (pathname === "/manager")
      return "Dashboard";

    if (pathname.startsWith("/manager/bookings"))
      return "Bookings";

    if (pathname.startsWith("/manager/apartments"))
      return "Apartments";

    // ================= RECEPTIONIST =================
    if (pathname === "/receptionist")
      return "Dashboard";

    if (pathname.startsWith("/receptionist/bookings"))
      return "Bookings";

    if (pathname.startsWith("/receptionist/checkin"))
      return "Check In";

    if (pathname.startsWith("/receptionist/checkout"))
      return "Check Out";

    if (pathname.startsWith("/receptionist/apartments"))
      return "Apartments";

    return "Dashboard";
  };

  // Get the title for the current path or default to "Page"
  const currentTitle = getPageTitle(location.pathname) || "Dashboard";

  
  // const currentTitle = routeTitles[location.pathname] || "Dashboard";

  return (
    <header className="header">
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className="header-content">
        <h1 className="header-title">{currentTitle}</h1>
        <div className="header-right">
          <button className="notification-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.73 21a2 2 0 01-3.46 0"></path>
              <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
            </svg>
          </button>
          <div className="profile-dropdown">
            <div>
              <div className="profile-circle">{userFirstLetter || "A"}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
