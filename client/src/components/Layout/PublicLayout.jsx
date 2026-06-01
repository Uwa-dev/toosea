import { Outlet, useLocation } from "react-router-dom";
import UserNav from "../static/UserNav/UserNav";
import Footer from "../static/Footer/footer";

const PublicLayout = () => {
    console.log("PublicLayout rendering");
  const location = useLocation();
  console.log("Current path:", location.pathname);
  const hideNavbar = location.pathname === "/login";

  return (
    <div>
      {!hideNavbar && <UserNav />}
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default PublicLayout;