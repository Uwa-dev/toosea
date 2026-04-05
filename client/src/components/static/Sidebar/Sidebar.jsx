import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  LogOutIcon, 
  Box,
  Eye,
  ChevronUp,
  ChevronDownIcon,
  CalendarRange,
  LibraryBig
} from "lucide-react";
import './sidebar.css'

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const location = useLocation();


  const [roomsOpen, setRoomsOpen] = useState(false);

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
          <Link
            to="/admin"
            className={`sidebar-link ${location.pathname === "/admin" ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <HomeIcon className="icon" />
            Dashboard
          </Link>


          {/* Products */}
          <div className="dropdown">
            <button
              onClick={() => setRoomsOpen(!roomsOpen)}
              className={`dropdown-button ${
                location.pathname.includes("/admin/products") ? "active" : ""
              }`}
            >
              <Box className="icon"/>
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
                  to="/admin/products/add"
                  className={`dropdown-link ${
                    location.pathname === "/admin/products/add" ? "active" : ""
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Add Rooms
                </Link>
                <Link
                  to="/admin/products"
                  className={`dropdown-link ${
                    location.pathname === "/admin/products" ? "active" : ""
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Available Rooms
                </Link>
              </div>
            )}
          </div>

          {/* Orders */}
        

          
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