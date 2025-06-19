import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import HomePage from "./pages/home/page";
import HomeLayout from "./layouts/HomeLayout";
import { GuestOnlyRoute } from "./api/GuestRoute";
import ProtectedRoute from "./api/ProtectedRoute";
import NotFoundPage from "./pages/not-found/page";
import { Toaster } from "sonner";
import ChatPage from "./pages/chat/page";
import { useAuthStore } from "./store";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserDetails } from "./api/routes";
import ChatModal from "./pages/chat-modal/page";

const Login = lazy(() => import("./pages/Login/page"));
const Signup = lazy(() => import("./pages/Signup/page"));

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore.getState().user?.token;
  const { data: usersDetails, isLoading } = useQuery({
    queryKey: ["get-currentUserDetails"],
    queryFn: getCurrentUserDetails,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  console.log(localStorage.getItem("auth-storage"), "dfdsfds");
  useEffect(() => {
    if (usersDetails) {
      setUser({
        ...usersDetails,
        token,
      });
    }
  }, [usersDetails]);

  return (
    <Suspense fallback={<p>Loading</p>}>
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:id" element={<ChatModal />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </Suspense>
  );
}

export default App;
