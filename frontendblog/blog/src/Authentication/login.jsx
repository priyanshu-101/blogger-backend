import React, { useState } from "react";
import { loginuser, forgetpassword } from "../api/authapi";
import { sendotp } from "../api/otp";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Loader from "../spinner/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));

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
        
        // Check if there's an OTP verification in progress
        const otpEmail = sessionStorage.getItem("otpEmail");
        
        // If OTP verification is in progress and email doesn't match
        if (otpEmail && otpEmail !== email) {
          setErrors({ 
            email: `OTP verification is in progress for ${otpEmail}. Please use that email or complete the OTP verification first.`
          });
          setLoading(false);
          return;
        }
        
        const response = await loginuser(email, password);
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          
          // If login was successful and there was an OTP verification in progress, clear it
          if (otpEmail === email) {
            sessionStorage.removeItem("otpEmail");
          }
          
          navigate(`/home/${response?.data?.user?.id}`);
        }
      } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 401) {
          setErrors({ password: "Invalid email or password" });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    try {
      if (!email) {
        setErrors({ ...errors, email: "Email is required for password reset" });
        return;
      }
      setLoading(true);
      const response = forgetpassword(email);
      if (response.status === 200) {
        alert('Password reset link sent to your email!');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setErrors({ ...errors, email: "Email is required to send OTP" });
      return;
    }
    try {
      setLoading(true);
      const response = await sendotp(email);
      if (response.status === 200) {
        // Store email in session storage to access in OTP verification component
        sessionStorage.setItem("otpEmail", email);
        // Store timestamp for OTP expiration (e.g., 10 minutes)
        sessionStorage.setItem("otpTimestamp", Date.now());
        // Navigate to OTP verification component
        navigate('/verify');
      }
    } catch (err) {
      console.log(err);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if there's an active OTP verification when component mounts
  React.useEffect(() => {
    const otpEmail = sessionStorage.getItem("otpEmail");
    const otpTimestamp = sessionStorage.getItem("otpTimestamp");
    
    // If there's an active OTP verification
    if (otpEmail && otpTimestamp) {
      // Check if OTP has expired (after 10 minutes)
      const currentTime = Date.now();
      const otpTime = parseInt(otpTimestamp, 10);
      const tenMinutesInMs = 10 * 60 * 1000;
      
      if (currentTime - otpTime > tenMinutesInMs) {
        // OTP has expired, clear session storage
        sessionStorage.removeItem("otpEmail");
        sessionStorage.removeItem("otpTimestamp");
      } else {
        // Pre-fill the email field with the OTP email
        setEmail(otpEmail);
      }
    }
  }, []);

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
          
          {sessionStorage.getItem("otpEmail") && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded" role="alert">
              <p>OTP verification in progress for: <strong>{sessionStorage.getItem("otpEmail")}</strong></p>
              <p className="text-sm">Please use this email address to log in or complete OTP verification.</p>
            </div>
          )}
          
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

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-700 hover:text-green-800"
              >
                Forgot Password?
              </button>
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