import React, { useState, useEffect } from "react";
import { verifyotp } from "../api/otp";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Loader from "../spinner/Loader";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem("otpEmail");
    const otpTimestamp = sessionStorage.getItem("otpTimestamp");
    
    // If email not found or OTP has expired, redirect back to login
    if (!storedEmail || !otpTimestamp) {
      navigate('/login');
      return;
    }
    
    // Check if OTP has expired (after 10 minutes)
    const currentTime = Date.now();
    const otpTime = parseInt(otpTimestamp, 10);
    const tenMinutesInMs = 10 * 60 * 1000;
    
    if (currentTime - otpTime > tenMinutesInMs) {
      // OTP has expired, clear session storage and redirect
      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpTimestamp");
      navigate('/login', { state: { message: "OTP has expired. Please request a new one." } });
      return;
    }
    
    setEmail(storedEmail);
    
    // Setup countdown for resend button
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await verifyotp(email, otp);
        if (response.status === 200) {
            alert('OTP verified successfully!');
          
          navigate(`/login`);
        }
      } catch (err) {
        console.log(err);
        setErrors({ otp: "Invalid OTP. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };
  
//   const handleResendOtp = async () => {
//     if (canResend) {
//       try {
//         setLoading(true);
//         const response = await resendOtp(email);
//         if (response.status === 200) {
//           setCanResend(false);
//           setCountdown(60);
//           // Update timestamp for OTP expiration
//           sessionStorage.setItem("otpTimestamp", Date.now());
          
//           // Restart countdown
//           const timer = setInterval(() => {
//             setCountdown(prev => {
//               if (prev <= 1) {
//                 clearInterval(timer);
//                 setCanResend(true);
//                 return 0;
//               }
//               return prev - 1;
//             });
//           }, 1000);
//           alert('OTP has been resent to your email!');
//         }
//       } catch (err) {
//         console.log(err);
//         alert('Failed to resend OTP. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
  
  const handleCancel = () => {
    // Don't remove the email from session storage when canceling
    // This ensures the restriction stays in place until OTP expires
    navigate('/login');
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
          <h1 className="text-3xl font-bold text-center">Verify OTP</h1>
          <p className="text-center text-gray-600">
            We've sent a verification code to<br />
            <span className="font-semibold">{email}</span>
          </p>
          
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                maxLength={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-center text-xl tracking-widest ${
                  errors.otp
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>
              )}
            </div>
            
            <div className="flex justify-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-500">
                  Resend OTP in {countdown} seconds
                </p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                disabled={loading}
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;