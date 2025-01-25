import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Register from "./Authentication/Register"; 
import Login from "./Authentication/login";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </Router>
  );
};

export default App;
