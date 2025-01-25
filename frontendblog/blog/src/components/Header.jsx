import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For routing
import { MoreVertical, ChevronDown } from "lucide-react"; // Icons
import { logoutuser } from "../api/authapi";

const Header = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility for the three-dot menu
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // State to handle user dropdown visibility

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await logoutuser(storedUser?.email); // Await the API call
      if (response && response.status === 200) {
        // Clear local storage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        
        // Redirect to the login page
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-semibold">
          <Link to="/" className="hover:text-blue-300 transition-colors">
            MyApp
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link to="/home" className="hover:text-blue-300 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-300 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-300 transition-colors">
                Contact
              </Link>
            </li>
          </ul>

          {/* Conditional rendering for user authentication */}
          {storedUser ? (
            <div className="relative">
              {/* Display username */}
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2 text-white focus:outline-none"
              >
                <span>{storedUser?.username}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                  <ul className="space-y-2 p-2">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                        onClick={() => setUserDropdownOpen(false)} // Close the menu when a link is clicked
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // Three-dot menu for unauthenticated users
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white focus:outline-none"
              >
                <MoreVertical className="w-6 h-6" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                  <ul className="space-y-2 p-2">
                    <li>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                        onClick={() => setDropdownOpen(false)} // Close the menu when a link is clicked
                      >
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                        onClick={() => setDropdownOpen(false)} // Close the menu when a link is clicked
                      >
                        Login
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
