import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Trash2, Heart, MessageCircle, Share2, Calendar, Clock } from "lucide-react";
import { getPostbyid, deletePost } from "../api/post";
import Loader from "../spinner/Loader";
import Header from "./Header";
import PostModal from "../components/ReadMore";

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        return <div className="text-center text-red-500 p-8 text-xl">{error}</div>;
    }

    const getImageUrl = (post) => {
        const seed = post._id || Math.random().toString(36).substring(7);
        return `/api/placeholder/600/400?text=${encodeURIComponent(post.title.substring(0, 20))}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        const nameParts = name.split(' ');
        if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">My Posts</h2>
                    <Link
                        to="/create-post"
                        className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Create New Post
                    </Link>
                </div>

                {loading ? (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Loader />
                    </div>
                ) : posts?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md">
                        <img
                            src="/api/placeholder/300/200?text=No+Posts+Found"
                            alt="No posts"
                            className="mb-6 rounded-lg opacity-60"
                        />
                        <p className="text-gray-500 text-xl mb-6">You haven't created any posts yet.</p>
                        <Link
                            to="/create-post"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Post
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts?.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden relative group"
                            >
                                {/* Featured Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        // src={getImageUrl(post)}
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvaBsIxY1Sb0C23gCIm54B4PeNKmEW7i5_ug&s"
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{post.title}</h3>

                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveDropdown(
                                                    activeDropdown === post._id ? null : post._id
                                                )}
                                                className="text-gray-500 hover:text-gray-700 p-1"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {activeDropdown === post._id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10 py-1">
                                                    <Link
                                                        to={`/edit-post/${post._id}`}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Edit Post
                                                    </Link>
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
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold mr-2">
                                            {getUserInitials(storedUser?.username)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {storedUser?.username || 'Anonymous User'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center text-xs text-gray-500 space-x-4 mb-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                        {post.readTime && (
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{post.readTime} min read</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                setSelectedPost(post);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 group"
                                        >
                                            <span>Read More</span>
                                            <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 space-x-1">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page =>
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            )
                            .map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span className="flex items-center px-3 text-gray-500">...</span>
                                    )}
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === page
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            } transition-colors`}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))
                        }

                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <PostModal
                post={selectedPost}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPost(null);
                }}
            />
        </div>
    );
};

export default Post;