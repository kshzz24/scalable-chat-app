import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

export const GuestOnlyRoute = () => {
  const user = useAuthStore((state) => state.user);
  return user ? <Navigate to="/" replace /> : <Outlet />;
};
