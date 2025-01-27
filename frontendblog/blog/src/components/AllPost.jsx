import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/post";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import { createComments, getComment } from "../api/comment";
import Header from "./Header";
import Loader from "../spinner/Loader";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState({});
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts();
        const sortedPosts = response?.data?.posts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
      setCurrentPage(1); 
    } catch (err) {
      console.error("Error refreshing posts:", err);
    } finally {
      setLoading(false);
    }
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
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div>
        <Header/>
    <div className="max-w-7xl mx-auto p-6">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <h1 className="text-4xl font-semibold text-center mb-6 text-blue-800">All Posts</h1>

      {currentPosts?.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="space-y-8">
          {currentPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-4">
                {post?.content?.length > 100
                  ? `${post.content.substring(0, 100)}...`
                  : post.content}
              </p>
              <Link
                to={`/posts/${post._id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Read More
              </Link>

              <div className="flex items-center space-x-6 text-gray-500 mt-4">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500">
                  <FaRegThumbsUp />
                  <span>Like</span>
                </div>
                <div
                  onClick={() => handleCommentClick(post._id)}
                  className="flex items-center space-x-1 cursor-pointer hover:text-blue-500"
                >
                  <FaRegComment />
                  <span>Comment</span>
                </div>
              </div>

              {commentId === post._id && (
                <div className="mt-4">
                  <textarea
                    value={commentText}
                    onChange={handleCommentTextChange}
                    rows="3"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your comment..."
                  />
                  <button
                    onClick={getcomments}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Submit Comment
                  </button>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => handleSeeAllComments(post._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  See All Comments
                </button>
              </div>

              {allComments[post._id] && (
                <div className="mt-4 space-y-2">
                  {allComments[post._id].map((comment) => (
                    <div key={comment._id} className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{comment.content}</p>
                      <p className="text-xs text-gray-400">By User {comment.userId}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all duration-200 ease-in-out"
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-blue-200'} transition-all duration-200`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all duration-200 ease-in-out"
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default AllPosts;