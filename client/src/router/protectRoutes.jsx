import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { user } = useSelector(
    (state) => state.user
  );

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User has permission
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect to user's own dashboard
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
      return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;