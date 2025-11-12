import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/CommentsSection';
import ImageLightbox from '../components/ImageLightbox';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const LostFoundDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [showLightbox, setShowLightbox] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            const res = await axios.get(`${API_URL}/lost-found/${id}`);
            setItem(res.data);
        } catch (err) {
            console.error('Failed to load item:', err);
        }
    };

    const handleClaim = async () => {
        if (!confirm('Claim this item?')) return;
        try {
            const res = await axios.post(`${API_URL}/lost-found/${id}/claim`, {}, { withCredentials: true });
            setItem(res.data);
            alert('Item claimed! Please contact the poster.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to claim');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this post?')) return;
        try {
            await axios.delete(`${API_URL}/lost-found/${id}`, { withCredentials: true });
            navigate('/lost-found');
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (!item) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    const isOwner = item.poster._id === user?._id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/lost-found" className="text-red-600 hover:text-red-700 font-medium mb-6 inline-block">← Back</Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className={`h-3 ${item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}></div>

                    {item.images && item.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 p-4">
                            {item.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`${item.title} ${idx + 1}`}
                                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                                    onClick={() => {
                                        setLightboxIndex(idx);
                                        setShowLightbox(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-4 py-2 rounded-full font-bold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.type === 'lost' ? '❌ LOST' : '✅ FOUND'}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{item.category}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.title}</h1>
                            </div>
                            {user && isOwner && (
                                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Delete</button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600">Location</div>
                                <div className="font-semibold text-gray-900">{item.location}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600">Date</div>
                                <div className="font-semibold text-gray-900">{new Date(item.date).toLocaleDateString()}</div>
                            </div>
                            {item.color && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Color</div>
                                    <div className="font-semibold text-gray-900">{item.color}</div>
                                </div>
                            )}
                            {item.brand && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Brand</div>
                                    <div className="font-semibold text-gray-900">{item.brand}</div>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>

                        {item.identifyingFeatures && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-2">Identifying Features</h2>
                                <p className="text-gray-700">{item.identifyingFeatures}</p>
                            </div>
                        )}

                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-3">Contact Information</h2>
                            <p className="text-lg font-semibold text-red-600">{item.contactInfo}</p>
                            {user && !isOwner && item.status === 'active' && (
                                <button onClick={handleClaim} className="mt-4 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-pink-700">
                                    {item.type === 'lost' ? 'I Found This!' : 'This is Mine!'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <CommentsSection postType="lostfound" postId={id} />
                </div>

                {item.images && item.images.length > 0 && (
                    <ImageLightbox
                        images={item.images}
                        isOpen={showLightbox}
                        onClose={() => setShowLightbox(false)}
                        initialIndex={lightboxIndex}
                    />
                )}
            </div>
        </div>
    );
};

export default LostFoundDetails;
