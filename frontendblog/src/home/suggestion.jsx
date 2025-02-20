import React, { useState, useEffect } from "react";
import { getPosts } from "../api/post";
import { Tag, Loader } from "lucide-react";

const Suggestion = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllTags = async () => {
            try {
                setLoading(true);
                let allTags = new Set();
                let currentPage = 1;
                let totalPages = 1;
                let fetchedAll = false;

                while (!fetchedAll) {
                    const response = await getPosts(currentPage);
                    const { posts, totalPages: apiTotalPages } = response.data;
                    posts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));
                    currentPage++;
                    if (currentPage > apiTotalPages) {
                        fetchedAll = true;
                    }
                    totalPages = apiTotalPages;
                }

                setTags([...allTags]);
            } catch (error) {
                console.error("Error fetching tags:", error);
                setError("Failed to load tags. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllTags();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Tag className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Suggested Tags</h2>
            </div>

            {error && (
                <div className="text-red-500 bg-red-50 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 
                                         text-blue-700 rounded-full font-medium text-sm
                                         hover:from-blue-100 hover:to-blue-200 
                                         transition-all duration-300 ease-in-out
                                         cursor-pointer shadow-sm hover:shadow
                                         hover:scale-105 active:scale-95"
                            >
                                #{tag}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center w-full py-4">
                            No tags available. Start adding tags to your posts!
                        </p>
                    )}
                </div>
            )}

            {!loading && tags.length > 0 && (
                <div className="mt-6 text-sm text-gray-500 text-center">
                    {tags.length} tags available
                </div>
            )}
        </div>
    );
};

export default Suggestion;