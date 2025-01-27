import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Register from "./Authentication/Register"; 
import Login from "./Authentication/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AllPosts from "./components/AllPost";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";

import { Link } from "react-router-dom";

const App = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={storedUser ? <Link to={`/home/${storedUser?.id}`} /> : <Link to="/login" />}
        />
        <Route
          path="/home/:id"
          element={storedUser?.id ? <Home /> : <Link to="/login" />}
        />
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
