import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { updateuser } from "../api/user";
import Loader from "../spinner/Loader";
// import Breadcrumbs from "./BreadCrumbs";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await updateuser(user.email, user.password, user.id);
            if (response && response.status === 200) {
                const updatedUser = response.data;
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}
            <Header />
            {/* <Breadcrumbs /> */}
            <div className="flex flex-col items-center py-8">
                <h1 className="text-3xl font-bold mb-6">Profile</h1>
                {user ? (
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white shadow-lg rounded-lg p-6 space-y-4 w-full max-w-md"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="id">
                                User ID
                            </label>
                            <input
                                id="id"
                                type="text"
                                value={user.id}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                            />
                        </div>

                        <button
                            onClick={handleUpdate}
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Update Profile
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-500">Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
