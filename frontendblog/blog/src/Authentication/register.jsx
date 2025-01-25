import React, { useState } from "react";
import { registeruser } from "../api/authapi";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await registeruser(name, email, password);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-sm p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)} 
            >
              {showPassword ? <EyeOff className="text-gray-400" /> : <Eye className="text-gray-400" />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Register
          </button>
          <div className="text-center mt-4">
            <a href="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Or Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
