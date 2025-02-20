import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
    const location = useLocation();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Split and filter the pathname
    const pathnames = location.pathname
        .split("/")
        .filter((x) => x && x !== "home" && x !== storedUser?.id); // Remove both "home" and user ID

    return (
        <nav className="text-gray-700 text-sm my-4 p-3 rounded-lg">
            <ul className="flex items-center space-x-2">
                {/* Home breadcrumb */}
                <li>
                    <Link
                        to={`/home/${storedUser?.id}`}
                        className="text-blue-500 font-medium hover:text-blue-700 transition"
                    >
                        Home
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    // Reconstruct the path including the user ID when necessary
                    const segments = [...pathnames.slice(0, index + 1)];
                    if (segments[0] === 'home') {
                        segments.splice(1, 0, storedUser?.id);
                    }
                    const to = `/${segments.join("/")}`;

                    return (
                        <li key={to} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                            <Link
                                to={to}
                                className="text-gray-600 font-medium hover:text-blue-500 transition capitalize"
                            >
                                {decodeURIComponent(value)}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;