import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRouter = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case "OWNER":
      return <Navigate to="/admin" replace />;

    case "MANAGER":
      return <Navigate to="/manager" replace />;

    case "RECEPTIONIST":
      return <Navigate to="/receptionist" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default AuthRouter;