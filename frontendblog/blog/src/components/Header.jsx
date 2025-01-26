import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical, ChevronDown } from "lucide-react";
import { logoutuser } from "../api/authapi";
import Loader from "../spinner/Loader";

const Header = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            setLoading(true); 
            const response = await logoutuser(storedUser?.email);
            if (response && response.status === 200) {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                navigate("/login");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}

            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-semibold">
                        <Link to="/" className="hover:text-blue-300 transition-colors">
                            MyApp
                        </Link>
                    </div>

                    <nav className="flex items-center space-x-6">
                        <ul className="hidden md:flex space-x-6">
                            {storedUser ? (
                                <>
                                    <li>
                                        <Link to="/home" className="hover:text-blue-300 transition-colors">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/all" className="hover:text-blue-300 transition-colors">
                                            All Post
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/create" className="hover:text-blue-300 transition-colors">
                                            Create Post
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login" className="hover:text-blue-300 transition-colors">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/login" className="hover:text-blue-300 transition-colors">
                                            All Post
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/login" className="hover:text-blue-300 transition-colors">
                                            Create Post
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {storedUser ? (
                            <div className="relative">
                                <button
                                    onClick={toggleUserDropdown}
                                    className="flex items-center space-x-2 text-white focus:outline-none"
                                >
                                    <span>{storedUser?.username}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

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
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="text-white focus:outline-none"
                                >
                                    <MoreVertical className="w-6 h-6" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                                        <ul className="space-y-2 p-2">
                                            <li>
                                                <Link
                                                    to="/register"
                                                    className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Register
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/login"
                                                    className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                                                    onClick={() => setDropdownOpen(false)}
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
        </>
    );
};

export default Header;
