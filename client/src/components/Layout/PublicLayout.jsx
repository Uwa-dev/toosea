import { Outlet, useLocation } from "react-router-dom";
import UserNav from "../static/UserNav/UserNav";

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
    </div>
  );
};

export default PublicLayout;