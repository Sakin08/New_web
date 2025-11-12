import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const UserProfile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/${id}`, {
                withCredentials: true
            });
            setProfile(res.data.user);
            setReviews(res.data.reviews);
            setIsFollowing(res.data.user.followers.some(f => f._id === currentUser?._id));
        } catch (err) {
            console.error('Failed to load profile:', err);
        }
        setLoading(false);
    };

    const handleFollow = async () => {
        try {
            const res = await axios.post(`${API_URL}/users/${id}/follow`, {}, {
                withCredentials: true
            });
            setIsFollowing(res.data.isFollowing);
            setProfile(prev => ({
                ...prev,
                followers: res.data.isFollowing
                    ? [...prev.followers, currentUser]
                    : prev.followers.filter(f => f._id !== currentUser._id)
            }));
        } catch (err) {
            console.error('Failed to follow:', err);
        }
    };

    const handleSubmitReview = async () => {
        try {
            await axios.post(`${API_URL}/users/reviews`, {
                revieweeId: id,
                ...reviewData
            }, { withCredentials: true });

            setShowReviewModal(false);
            setReviewData({ rating: 5, comment: '' });
            loadProfile();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser?._id === id;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <div className="flex items-start gap-6">
                        <UserAvatar user={profile} size="xl" />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                {profile.isStudentVerified && (
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        ✓ Verified Student
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-600 mb-1">{profile.email}</p>
                            <p className="text-gray-600 mb-3">📚 {profile.department}</p>

                            {profile.bio && (
                                <p className="text-gray-700 mb-4">{profile.bio}</p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-6 mb-4">
                                <div>
                                    <span className="font-bold text-xl text-gray-900">{profile.followers?.length || 0}</span>
                                    <span className="text-gray-600 ml-1">Followers</span>
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-gray-900">{profile.following?.length || 0}</span>
                                    <span className="text-gray-600 ml-1">Following</span>
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-gray-900">{profile.rating.toFixed(1)}</span>
                                    <span className="text-yellow-500 ml-1">⭐</span>
                                    <span className="text-gray-600 ml-1">({profile.reviewCount} reviews)</span>
                                </div>
                            </div>

                            {/* Interests */}
                            {profile.interests?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {profile.interests.map((interest, i) => (
                                        <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Badges */}
                            {profile.badges?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {profile.badges.map((badge, i) => (
                                        <span key={i} className="text-2xl" title={badge}>
                                            {badge === 'top_seller' && '🏆'}
                                            {badge === 'verified' && '✅'}
                                            {badge === 'helpful' && '🌟'}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!isOwnProfile && currentUser && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleFollow}
                                        className={`px-6 py-2 rounded-lg font-semibold transition ${isFollowing
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button
                                        onClick={() => setShowReviewModal(true)}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        Write Review
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No reviews yet</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                                    <div className="flex items-start gap-3">
                                        <UserAvatar user={review.reviewer} size="sm" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900">{review.reviewer.name}</span>
                                                <span className="text-yellow-500">
                                                    {'⭐'.repeat(review.rating)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-1">{review.comment}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        className="text-3xl"
                                    >
                                        {star <= reviewData.rating ? '⭐' : '☆'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                rows="4"
                                placeholder="Share your experience..."
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitReview}
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                            >
                                Submit Review
                            </button>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
