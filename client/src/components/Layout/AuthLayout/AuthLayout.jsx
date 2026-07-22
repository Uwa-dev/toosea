import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

import Sidebar from "../../static/Sidebar/Sidebar";
import Header from "../../static/Header/Header";

import { logout } from "../../../utils/slices/userSlice";

import "./authlayout.css";

const AuthLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", { replace: true });
  };

  return (
    <div className="main-body">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <main>
        <Header setSidebarOpen={setSidebarOpen} />

        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;