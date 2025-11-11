import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const MessageButton = ({ postOwnerId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Don't show if not logged in or if viewing own post
    if (!user || user._id === postOwnerId) return null;

    return (
        <button
            onClick={() => navigate(`/chat/${postOwnerId}`)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
            💬 Message Seller
        </button>
    );
};

export default MessageButton;
