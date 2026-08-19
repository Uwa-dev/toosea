import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  // ========================================
  // NOT LOGGED IN
  // ========================================

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ========================================
  // MUST CHANGE PASSWORD
  // ========================================

  if (
    user.mustChangePassword &&
    location.pathname !== "/change-password"
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  // ========================================
  // ALLOW CHANGE PASSWORD PAGE
  // ========================================

  if (
    user.mustChangePassword &&
    location.pathname === "/change-password"
  ) {
    return children;
  }

  // ========================================
  // ROLE PERMISSION
  // ========================================

  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // ========================================
  // REDIRECT TO OWN DASHBOARD
  // ========================================

  switch (user.role) {
    case "OWNER":
      return <Navigate to="/admin" replace />;

    case "MANAGER":
      return <Navigate to="/manager" replace />;

    case "RECEPTIONIST":
      return (
        <Navigate
          to="/receptionist"
          replace
        />
      );

    default:
      return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;