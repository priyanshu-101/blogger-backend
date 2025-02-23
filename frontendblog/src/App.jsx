import {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Authentication/Register";
import Login from "./Authentication/login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AllPosts from "./components/AllPost";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";
import ResetPassword from "./Authentication/ResetPassword";
import VerifyOTP from "./components/verifyotp";
import ReadMore from "./components/ReadMore";
import { Navigate } from "react-router-dom";



import { Link } from "react-router-dom";

const App = () => {
  // const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={`/home/${user?.id}`} replace /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/home/:id"
          element={user?.id ? <Home /> : <Link to="/login" />}
        />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/posts/:id" element={<ReadMore />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all" element={<AllPosts />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </Router>
  );
};

export default App;
