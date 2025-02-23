import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegComment, FaRegThumbsUp, FaThumbsUp, FaRegClock, FaImage } from "react-icons/fa";
import { getPosts } from "../api/post";
import { createComments, getComment } from "../api/comment";
import { likepost, getlikes } from "../api/likeapi";
import Header from "./Header";
import Loader from "../spinner/Loader";
import PostModal from "./ReadMore";
// import Breadcrumbs from "./BreadCrumbs";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState({});
  const [postLikes, setPostLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const postsPerPage = 10;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts();
        const sortedPosts = response?.data?.posts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
        sortedPosts.forEach(post => {
          fetchLikes(post._id);
        });
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchLikes = async (postId) => {
    try {
      const likes = await getlikes(postId);
      setPostLikes(prev => ({
        ...prev,
        [postId]: likes.data?.likes || 0
      }));
      setLikedPosts(prev => ({
        ...prev,
        [postId]: likes.data?.isLikedByUser || false
      }));
    } catch (err) {
      console.error(`Error fetching likes for post ${postId}:`, err);
      setPostLikes(prev => ({
        ...prev,
        [postId]: 0
      }));
    }
  };

  const handleLikeClick = async (postId) => {
    try {
      setLoading(true);
      const response = await likepost(postId, storedUser?.id);

      if (response) {
        setLikedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        setPostLikes(prev => ({
          ...prev,
          [postId]: prev[postId] + (likedPosts[postId] ? -1 : 1)
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("An error occurred while liking the post.");
    } finally {
      setLoading(false);
    }
  };

  const getcomments = async () => {
    try {
      setLoading(true);
      if (commentId && commentText) {
        const response = await createComments(commentId, commentText);
        if (response) {
          alert("Comment added successfully!");
          setCommentText("");
          await refreshPosts();
        }
      } else {
        alert("Please enter a comment before submitting.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An error occurred while adding the comment.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      setLoading(true);
      const response = await getComment(postId);
      setAllComments((prevComments) => ({
        ...prevComments,
        [postId]: response?.data?.comments,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("An error occurred while fetching the comments.");
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      const sortedPosts = response?.data?.posts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error refreshing posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalPages = Math.ceil(posts?.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCommentClick = (postId) => {
    setCommentId(postId);
  };

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSeeAllComments = (postId) => {
    if (!allComments[postId]) {
      fetchComments(postId);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Community Posts</h1>
          <p className="text-center text-gray-600">Join the conversation and share your thoughts</p>
          {/* <Breadcrumbs /> */}
        </div>

        {currentPosts?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No posts available yet.</p>
            <p className="text-gray-400 mt-2">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaRegClock className="text-gray-400" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                {/* Image Section */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/800/400";
                        e.target.alt = "Post image placeholder";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                      {/* <FaImage className="text-gray-400 text-4xl" /> */}
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvaBsIxY1Sb0C23gCIm54B4PeNKmEW7i5_ug&s"
                        alt="Post image placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {post?.content?.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
                </p>

                <div className="flex justify-between items-center mb-6">
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

                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleLikeClick(post._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${likedPosts[post._id]
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {likedPosts[post._id] ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    <span>{postLikes[post._id] || 0} Likes</span>
                  </button>

                  <button
                    onClick={() => handleCommentClick(post._id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <FaRegComment />
                    <span>Comment</span>
                  </button>
                </div>

                {commentId === post._id && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <textarea
                      value={commentText}
                      onChange={handleCommentTextChange}
                      rows="3"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Share your thoughts..."
                    />
                    <button
                      onClick={getcomments}
                      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                )}

                {allComments[post._id] ? (
                  <div className="mt-4 space-y-3">
                    {allComments[post._id].map((comment) => (
                      <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{comment.content}</p>
                        <p className="text-sm text-gray-500 mt-2">Posted by User {comment.userId}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSeeAllComments(post._id)}
                    className="mt-4 text-gray-600 hover:text-blue-600 text-sm font-medium"
                  >
                    View all comments
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center mt-12 space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
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

export default AllPosts;