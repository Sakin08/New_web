import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/CommentsSection';
import ImageLightbox from '../components/ImageLightbox';
import PosterInfo from '../components/PosterInfo';
import MessageButton from '../components/MessageButton';
import { ChevronLeft, MapPin, Calendar, Tag, HardHat, AlertTriangle, CheckCircle, Mail, Trash2 } from 'lucide-react'; // Suggested icons

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const LostFoundDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const [showLightbox, setShowLightbox] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Color/Icon configuration based on item type
    const isLost = item?.type === 'lost';
    const primaryColor = isLost ? 'red' : 'green';
    const primaryClass = isLost ? 'text-red-600' : 'text-green-600';
    const bgPrimaryClass = isLost ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/lost-found/${id}`);
            setItem(res.data);
        } catch (err) {
            console.error('Failed to load item:', err);
            // Handle 404/not found error state here if needed
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async () => {
        const message = isLost
            ? 'Confirm you found this item? The poster will be notified.'
            : 'Confirm this is your item? The poster will be notified.';

        if (!confirm(message)) return;

        try {
            const res = await axios.post(`${API_URL}/lost-found/${id}/claim`, {}, { withCredentials: true });
            setItem(res.data);
            alert(`Success! Status updated to "Claimed". Please contact the poster.`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit claim.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this post?')) return;
        try {
            await axios.delete(`${API_URL}/lost-found/${id}`, { withCredentials: true });
            navigate('/lost-found');
        } catch (err) {
            alert('Failed to delete post.');
        }
    };

    // --- Loading State ---
    if (loading || !item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center p-8 bg-gray-50 rounded-xl shadow-lg">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Loading item details...</p>
                </div>
            </div>
        );
    }

    const isOwner = item.poster?._id === user?._id;

    // Status component rendering logic
    const renderStatusBadge = () => {
        let statusClass = '';
        let statusIcon = '';
        let statusLabel = '';

        switch (item.status) {
            case 'active':
                statusClass = 'bg-green-100 text-green-700';
                statusIcon = <CheckCircle size={18} />;
                statusLabel = 'Active';
                break;
            case 'claimed':
                statusClass = 'bg-yellow-100 text-yellow-700';
                statusIcon = <AlertTriangle size={18} />;
                statusLabel = 'Claimed - Contact Poster!';
                break;
            case 'resolved':
                statusClass = 'bg-gray-100 text-gray-700';
                statusIcon = <Tag size={18} />;
                statusLabel = 'Resolved';
                break;
            default:
                statusClass = 'bg-gray-100 text-gray-700';
                statusIcon = <Tag size={18} />;
                statusLabel = 'Unknown';
        }

        return (
            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusClass}`}>
                {statusIcon} {statusLabel}
            </span>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                
                {/* Back Link */}
                <Link 
                    to="/lost-found" 
                    className={`flex items-center ${primaryClass} hover:text-red-700 font-medium mb-6 transition`}
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Back to Lost & Found Listings
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    
                    {/* Header Bar */}
                    <div className={`py-4 px-8 font-bold text-white text-xl ${isLost ? 'bg-red-600' : 'bg-green-600'} flex justify-between items-center`}>
                        <span className="flex items-center gap-3">
                            {isLost ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                            {isLost ? 'LOST ITEM REPORT' : 'FOUND ITEM REPORT'}
                        </span>
                        {/* Owner Actions */}
                        {user && isOwner && (
                            <button onClick={handleDelete} className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition text-sm">
                                <Trash2 size={16} /> Delete Post
                            </button>
                        )}
                    </div>

                    {/* Main Grid: Details (Left) and Contact/Action (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                        
                        {/* LEFT COLUMN: Image, Title, Description, Features (lg:col-span-2) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Image Gallery */}
                            {item.images && item.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {item.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${item.title} ${idx + 1}`}
                                            className="w-full h-36 sm:h-48 object-cover rounded-xl cursor-pointer shadow-md hover:shadow-lg hover:opacity-90 transition"
                                            onClick={() => {
                                                setLightboxIndex(idx);
                                                setShowLightbox(true);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Title & Status */}
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{item.title}</h1>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className={`px-4 py-2 rounded-full font-bold text-xs tracking-wider ${isLost ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                        {isLost ? 'LOST' : 'FOUND'}
                                    </span>
                                    {renderStatusBadge()}
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{item.category}</span>
                                </div>
                            </div>
                            
                            {/* Key Features/Attributes */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-xs text-gray-600 font-medium flex items-center mb-1"><MapPin size={14} className="mr-1 text-blue-500" /> Location</div>
                                    <div className="font-semibold text-gray-900">{item.location}</div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="text-xs text-gray-600 font-medium flex items-center mb-1"><Calendar size={14} className="mr-1 text-blue-500" /> Date</div>
                                    <div className="font-semibold text-gray-900">{new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
                                </div>
                                {item.color && (
                                    <div className="col-span-1">
                                        <div className="text-xs text-gray-600 font-medium mb-1">Color</div>
                                        <div className="font-semibold text-gray-900">{item.color}</div>
                                    </div>
                                )}
                                {item.brand && (
                                    <div className="col-span-1">
                                        <div className="text-xs text-gray-600 font-medium mb-1">Brand</div>
                                        <div className="font-semibold text-gray-900">{item.brand}</div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="pt-4 border-t border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">Item Description</h2>
                                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{item.description}</p>
                            </div>

                            {/* Identifying Features */}
                            {item.identifyingFeatures && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                                        <HardHat size={20} className="mr-2 text-red-500" />
                                        Unique Marks / Features
                                    </h2>
                                    <p className="text-gray-700 text-base whitespace-pre-line">{item.identifyingFeatures}</p>
                                </div>
                            )}

                            {/* Poster Info (Moved below description) */}
                            <div className="pt-6 border-t border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">Posted By</h2>
                                <PosterInfo user={item.poster} createdAt={item.createdAt} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Contact and Action Sidebar (lg:col-span-1) */}
                        <div className="lg:col-span-1 space-y-6 lg:border-l lg:border-gray-100 lg:pl-6 pt-6 lg:pt-0">
                            
                            {/* Contact & Claim Section */}
                            <div className="p-5 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
                                <h3 className="text-lg font-bold text-red-700 mb-3 border-b border-red-200 pb-2">
                                    Next Steps
                                </h3>

                                {/* Claim Status Info */}
                                {item.status === 'claimed' && item.claimedBy ? (
                                    <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                                        <p className="text-sm font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                                            <AlertTriangle size={18} /> CLAIMED!
                                        </p>
                                        <p className="text-xs text-yellow-900">
                                            This item has been claimed by **{item.claimedBy.name}**.
                                        </p>
                                        <p className="text-xs text-yellow-900 mt-1">
                                            Poster must now verify and resolve the case.
                                        </p>
                                    </div>
                                ) : (
                                    // Claim Action Button
                                    user && !isOwner && item.status === 'active' && (
                                        <button 
                                            onClick={handleClaim} 
                                            className={`w-full ${bgPrimaryClass} text-white py-3 rounded-lg font-bold text-base transition shadow-md`}
                                        >
                                            {isLost ? '✅ I Found This Item!' : '✅ This is My Item!'}
                                        </button>
                                    )
                                )}

                                {/* Message Option for Non-Owners */}
                                {user && !isOwner && item.poster && (
                                    <>
                                        <div className="text-center text-sm font-semibold text-gray-600 pt-1">
                                            OR Contact the Poster Directly
                                        </div>
                                        <div className="flex gap-2">
                                            <MessageButton 
                                                recipientId={item.poster._id} 
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition shadow-sm"
                                            />
                                            {item.poster.email && (
                                                <a
                                                    href={`mailto:${item.poster.email}`}
                                                    className="w-1/2 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 border border-gray-300 shadow-sm"
                                                >
                                                    <Mail size={16} /> Email
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-700 font-semibold mt-2 border-t pt-2">
                                            Contact Info shared by Poster: <span className="text-red-600">{item.contactInfo}</span>
                                        </p>
                                    </>
                                )}

                                {/* Message for Logged-Out/Owner */}
                                {!user && (
                                    <Link to="/login" className="w-full text-center block bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
                                        Log in to Contact or Claim
                                    </Link>
                                )}

                                {isOwner && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-800">
                                        This is your post. You cannot claim or message yourself.
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <CommentsSection postType="lostfound" postId={id} />
                </div>

                {/* Lightbox */}
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