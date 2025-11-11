import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chatApi from '../api/chat.js';
import { useSocket } from '../context/SocketContext.jsx';

const Messages = () => {
    const [chats, setChats] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessageNotification', () => {
            loadChats();
        });

        return () => socket.off('newMessageNotification');
    }, [socket]);

    const loadChats = async () => {
        try {
            const res = await chatApi.getRecentChats();
            setChats(res.data);
        } catch (err) {
            console.error('Failed to load chats:', err);
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const msgDate = new Date(date);
        const diffMs = now - msgDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return msgDate.toLocaleDateString();
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>

            {chats.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start a conversation from a post</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {chats.map(chat => (
                        <Link
                            key={chat.chatId}
                            to={`/chat/${chat.otherUser._id}`}
                            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {chat.otherUser.name[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold">{chat.otherUser.name}</h3>
                                        <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unreadCount > 0 && (
                                    <div className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                        {chat.unreadCount}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
