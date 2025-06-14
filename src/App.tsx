import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "./pages/home/page";
import HomeLayout from "./layouts/HomeLayout";

const Login = lazy(() => import("./pages/Login/page"));
const Signup = lazy(() => import("./pages/Signup/page"));

function App() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomeLayout />}>
          <Route path="chat" element={<HomePage />} />
          <Route path="group" element={<HomePage />} />
          <Route path="calls" element={<HomePage />} />
          <Route path="video" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
