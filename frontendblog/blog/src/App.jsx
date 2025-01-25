import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import Register from "./Authentication/Register"; 
import Login from "./Authentication/login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AllPosts from "./components/AllPost";

const App = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route
          path="/home/:id"
          element={storedUser?.id? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={storedUser?.id ? <Navigate to={`/home/${storedUser?.id}`} /> : <Navigate to="/login" />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all" element={<AllPosts />} />

      </Routes>
    </Router>
  );
};

export default App;
