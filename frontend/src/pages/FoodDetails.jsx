import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/CommentsSection';
import ImageLightbox from '../components/ImageLightbox';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const FoodDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLightbox, setShowLightbox] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            const res = await axios.get(`${API_URL}/food/${id}`);
            setOrder(res.data);
        } catch (err) {
            console.error('Failed to load order:', err);
        }
        setLoading(false);
    };

    const handleJoin = async () => {
        const contribution = prompt('Enter your contribution amount (৳):');
        const items = prompt('What items are you ordering?');

        if (!contribution || !items) return;

        try {
            const res = await axios.post(`${API_URL}/food/${id}/join`, {
                contribution: parseFloat(contribution),
                items
            }, { withCredentials: true });
            setOrder(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join order');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this food order?')) return;
        try {
            await axios.delete(`${API_URL}/food/${id}`, { withCredentials: true });
            navigate('/food');
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                    <Link to="/food" className="text-orange-600 hover:text-orange-700 mt-4 inline-block">
                        ← Back to Food Orders
                    </Link>
                </div>
            </div>
        );
    }

    const isOrganizer = order.organizer._id === user?._id;
    const hasJoined = order.participants.some(p => p.user._id === user?._id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/food" className="text-orange-600 hover:text-orange-700 font-medium mb-6 inline-block">
                    ← Back to Food Orders
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {order.image && (
                        <div className="relative h-96 cursor-pointer" onClick={() => setShowLightbox(true)}>
                            <img src={order.image} alt={order.restaurant} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                Click to enlarge
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.orderType === 'group-order' ? 'bg-blue-100 text-blue-700' :
                                        order.orderType === 'meal-sharing' ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.orderType.replace('-', ' ').toUpperCase()}
                                </span>
                                <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-2">{order.restaurant}</h1>
                                {order.cuisine && <p className="text-lg text-orange-600">{order.cuisine}</p>}
                            </div>
                            {user && isOrganizer && (
                                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                                    Delete
                                </button>
                            )}
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">{order.description}</p>

                        {order.orderType === 'group-order' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {order.totalCost && (
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600">Total Cost</div>
                                        <div className="text-2xl font-bold text-orange-600">৳{order.totalCost}</div>
                                    </div>
                                )}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Participants</div>
                                    <div className="text-2xl font-bold text-gray-900">{order.participants.length}</div>
                                </div>
                                {order.deliveryLocation && (
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600">Delivery</div>
                                        <div className="font-semibold text-gray-900">{order.deliveryLocation}</div>
                                    </div>
                                )}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Status</div>
                                    <div className="font-semibold text-gray-900">{order.status.toUpperCase()}</div>
                                </div>
                            </div>
                        )}

                        {order.participants.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-3">Participants</h2>
                                <div className="space-y-2">
                                    {order.participants.map((p, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{p.user.name}</span>
                                            <div className="text-right">
                                                {p.contribution && <div className="font-bold text-orange-600">৳{p.contribution}</div>}
                                                {p.items && <div className="text-sm text-gray-600">{p.items}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user && !isOrganizer && !hasJoined && order.status === 'open' && (
                            <button onClick={handleJoin} className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition shadow-lg">
                                Join Order
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <CommentsSection postType="food" postId={id} />
                </div>

                {order.image && (
                    <ImageLightbox
                        images={[order.image]}
                        isOpen={showLightbox}
                        onClose={() => setShowLightbox(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default FoodDetails;
