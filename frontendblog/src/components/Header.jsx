import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical, ChevronDown, Menu, X } from "lucide-react";
import { logoutuser } from "../api/authapi";
import { removeuser } from "../api/user";
import Loader from "../spinner/Loader";

const Header = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const userDropdownRef = useRef(null);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setDropdownOpen(false);
        setUserDropdownOpen(false);
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
            setMobileMenuOpen(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const response = await removeuser(storedUser?.id);
            if (response && response.status === 200) {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                navigate("/register");
            }
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setLoading(false);
            setMobileMenuOpen(false);
        }
    };

    const MobileNavLinks = () => (
        <div className="md:hidden fixed inset-0 bg-blue-600 z-50 flex flex-col">
            <div className="flex justify-between p-4">
                <div className="text-2xl font-semibold">MyApp</div>
                <button onClick={toggleMobileMenu} className="text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
                {storedUser ? (
                    <>
                        <Link to="/" onClick={toggleMobileMenu} className="text-white text-xl">Home</Link>
                        <Link to="/all" onClick={toggleMobileMenu} className="text-white text-xl">All Post</Link>
                        <Link to="/create" onClick={toggleMobileMenu} className="text-white text-xl">Create Post</Link>
                        <Link to="/profile" onClick={toggleMobileMenu} className="text-white text-xl">Profile</Link>
                        <Link to="/post" onClick={toggleMobileMenu} className="text-white text-xl">Post</Link>
                        <button
                            onClick={handleLogout}
                            className="text-white text-xl text-left"
                        >
                            Logout
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-white text-xl text-left"
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={toggleMobileMenu} className="text-white text-xl">Home</Link>
                        <Link to="/login" onClick={toggleMobileMenu} className="text-white text-xl">All Post</Link>
                        <Link to="/login" onClick={toggleMobileMenu} className="text-white text-xl">Create Post</Link>
                        <Link to="/register" onClick={toggleMobileMenu} className="text-white text-xl">Register</Link>
                        <Link to="/login" onClick={toggleMobileMenu} className="text-white text-xl">Login</Link>
                    </>
                )}
            </nav>
        </div>
    );

    return (
        <>
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}

            {mobileMenuOpen && <MobileNavLinks />}

            <header className="bg-blue-600 text-white p-4 shadow-md relative">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-semibold">
                        {storedUser ? (
                            <Link to={`/home/${storedUser?.id}`} className="hover:text-blue-300 transition-colors">
                                MyApp
                            </Link>
                        ) : (
                            <Link to="/login" className="hover:text-blue-300 transition-colors">
                                MyApp
                            </Link>
                        )}
                    </div>

                    <nav className="flex items-center space-x-6">
                        <ul className="hidden md:flex space-x-6">
                            {storedUser ? (
                                <>
                                    <li>
                                        <Link to={`/home/${storedUser?.id}`} className="hover:text-blue-300 transition-colors">
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
                            <div className="relative hidden md:block" ref={userDropdownRef}>
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center space-x-2 text-white focus:outline-none"
                                >
                                    <span>{storedUser?.username}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-40">
                                        <ul className="space-y-2 p-2">
                                            <li>
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                                                    onClick={() => setUserDropdownOpen(false)}
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
                                            <li>
                                                <Link
                                                    to="/post"
                                                    className="block px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                >
                                                    Post
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleDelete}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 rounded-lg"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="text-white focus:outline-none"
                                >
                                    <MoreVertical className="w-6 h-6" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-40">
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

                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-white focus:outline-none"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;