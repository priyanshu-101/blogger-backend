import React, { useState } from "react";
import { loginuser } from "../api/authapi";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Loader from "../spinner/Loader"; // Assuming Loader is a spinner component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true); 
        const response = await loginuser(email, password);
        if (response) {
          if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate(`/home/${response?.data?.user?.id}`);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); 
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <Header />
      <div className="flex-grow flex items-center justify-center bg-black p-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-sm p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading} 
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
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading} 
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
              disabled={loading} 
            >
                Login
            </button>
            <div className="text-center mt-4">
              <a href="/register" className="text-sm text-gray-600 hover:text-blue-600">
                Or Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
