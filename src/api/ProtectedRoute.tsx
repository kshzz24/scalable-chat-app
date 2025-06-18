import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
