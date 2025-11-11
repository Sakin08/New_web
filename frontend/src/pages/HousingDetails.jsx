import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import MessageButton from '../components/MessageButton.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';

const HousingDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            const res = await api.get(`/housing/${id}`);
            setPost(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load housing:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!post) return <div className="container mx-auto p-6">Housing not found</div>;

    const images = post.images && post.images.length > 0 ? post.images : [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/housing" className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block">
                    ← Back to Housing
                </Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        {images.length > 0 && <ImageGallery images={images} />}

                        <div className="mt-6 flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <h1 className="text-4xl font-bold text-blue-600">৳{post.rent}</h1>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <div className="flex items-center text-gray-700 mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-lg">{post.address}</span>
                                </div>
                            </div>
                            <FavoriteButton postType="housing" postId={post._id} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 my-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Roommates Needed</p>
                                        <p className="text-2xl font-bold text-gray-900">{post.roommatesNeeded}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Contact</p>
                                        <p className="text-lg font-semibold text-gray-900">{post.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.description}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Posted By</h2>
                            <div className="flex items-center space-x-4">
                                {post.user?.profilePicture ? (
                                    <img
                                        src={post.user.profilePicture}
                                        alt={post.user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {post.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{post.user?.name}</p>
                                    <p className="text-sm text-gray-600">{post.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                            <span>👁️ {post.views || 0} views</span>
                            <span>Posted {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <MessageButton postOwnerId={post.user?._id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HousingDetails;
