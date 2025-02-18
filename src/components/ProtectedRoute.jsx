import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const ProtectedRoute = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  console.log("ProtectedRoute: currentUser:", currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
