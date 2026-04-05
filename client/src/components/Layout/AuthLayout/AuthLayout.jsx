import { Outlet } from "react-router-dom";
import Sidebar from "../../static/Sidebar/Sidebar.jsx";
import Header from "../../static/Header/Header.jsx"
import './authlayout.css'

const AdminLayout = () => {
  return (
    <div className="main-body">
      <Sidebar />
      <main>
        <Header />
        <div>
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;