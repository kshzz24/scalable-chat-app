import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login/page"));
const Signup = lazy(() => import("./pages/Signup/page"));

function App() {
  return (
    <Router>
      <Suspense fallback={<p>Loading</p>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
