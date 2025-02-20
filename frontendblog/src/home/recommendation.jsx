import { useState, useEffect } from 'react';
import { recommendpost } from '../api/post';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Loader';

const Recommendation = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const response = await recommendpost(storedUser?.id);
                setRecommendations(response.data.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                setError("Failed to load recommendations");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800">Recommended For You</h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Spinner />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : recommendations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">No recommendations available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((recommendation, index) => (
                        <Link 
                            to={`/posts/${recommendation._id}`}
                            key={recommendation._id || index}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="relative h-48 bg-gradient-to-r from-blue-100 to-blue-50">
                                <img 
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvaBsIxY1Sb0C23gCIm54B4PeNKmEW7i5_ug&s"
                                    alt="Post cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(recommendation.createdAt)}</span>
                                </div>

                                <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                    {recommendation.title}
                                </h2>

                                <p className="text-gray-600 mb-4 flex-grow">
                                    {recommendation.content?.length > 150 
                                        ? `${recommendation.content.substring(0, 150)}...` 
                                        : recommendation.content}
                                </p>

                                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                                    Read More 
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendation;
