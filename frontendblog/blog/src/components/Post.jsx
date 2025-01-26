import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Trash2 } from "lucide-react";
import { getPostbyid, deletePost } from "../api/post";
import Loader from "../spinner/Loader";
import Header from "./Header";

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const fetchUserPosts = async () => {
        if (!storedUser || !storedUser.id) {
            setError("User not found");
            return;
        }

        try {
            setLoading(true);
            const response = await getPostbyid(storedUser.id);
            setPosts(response.data);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error("Error fetching user posts:", err);
            setError("Failed to fetch user posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, [storedUser?.id]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const removePost = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await deletePost(postId);
            await fetchUserPosts();
            alert("Post deleted successfully!");
            setActiveDropdown(null);
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("An error occurred while deleting the post.");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto p-6">
                {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Loader />
                    </div>
                )}

                <h2 className="text-3xl font-bold mb-6 text-center">My Posts</h2>

                {posts?.length === 0 ? (
                    <p className="text-center text-gray-500">No posts found.</p>
                ) : (
                    <div className="space-y-6">
                        {posts?.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow relative"
                            >
                                <div className="absolute top-2 right-2">
                                    <button 
                                        onClick={() => setActiveDropdown(
                                            activeDropdown === post._id ? null : post._id
                                        )}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    
                                    {activeDropdown === post._id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                                            <button 
                                                onClick={() => removePost(post._id)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                                <p className="text-gray-600 mb-4">
                                    {post.content.length > 150
                                        ? `${post.content.substring(0, 150)}...`
                                        : post.content}
                                </p>
                                <div className="flex justify-between items-center">
                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Full Post
                                    </Link>
                                    <span className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Post;