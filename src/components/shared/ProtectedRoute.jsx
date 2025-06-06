import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initialized = useAuthStore((state) => state.initialized);
  const location = useLocation();

  if (!initialized) return null;

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
