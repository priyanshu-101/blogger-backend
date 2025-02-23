import React from 'react';

const PostModal = ({ post, onClose, isOpen }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">{formatDate(post?.createdAt)}</span>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 rounded-lg overflow-hidden">
                  {post?.image ? (
                    <img
                      src={post?.image}
                      alt={post?.title}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/800/400";
                        e.target.alt = "Post image placeholder";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvaBsIxY1Sb0C23gCIm54B4PeNKmEW7i5_ug&s"
                        alt="Post image placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{post?.title}</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{post?.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;