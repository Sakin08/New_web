import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chatApi from '../api/chat.js';
import { useSocket } from '../context/SocketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Chat = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const chatId = [user._id, userId].sort().join(':');

    useEffect(() => {
        loadMessages();
    }, [userId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinRoom', chatId);

        socket.on('receiveMessage', (message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
        });

        socket.on('userTyping', ({ isTyping }) => {
            setIsTyping(isTyping);
        });

        socket.on('messagesRead', () => {
            setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
        });

        // Mark as read when entering chat
        socket.emit('markAsRead', { chatId, userId: user._id });

        return () => {
            socket.off('receiveMessage');
            socket.off('userTyping');
            socket.off('messagesRead');
        };
    }, [socket, chatId]);

    const loadMessages = async () => {
        try {
            const res = await chatApi.getChatHistory(userId);
            setMessages(res.data);
            if (res.data.length > 0) {
                const other = res.data[0].senderId._id === user._id
                    ? res.data[0].receiverId
                    : res.data[0].senderId;
                setOtherUser(other);
            }
            scrollToBottom();
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit('sendMessage', {
            chatId,
            senderId: user._id,
            receiverId: userId,
            message: newMessage.trim(),
        });

        setNewMessage('');
        socket.emit('typing', { chatId, userId: user._id, isTyping: false });
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket) return;

        socket.emit('typing', { chatId, userId: user._id, isTyping: true });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { chatId, userId: user._id, isTyping: false });
        }, 1000);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="bg-white border-b p-4 flex items-center gap-3">
                <button onClick={() => navigate('/messages')} className="text-blue-600">
                    ← Back
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {otherUser?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                    <h2 className="font-semibold">{otherUser?.name || 'Loading...'}</h2>
                    {isTyping && <p className="text-xs text-gray-500">typing...</p>}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-12">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Start the conversation!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => {
                            const isOwn = msg.senderId._id === user._id;
                            return (
                                <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] ${isOwn ? 'bg-blue-600 text-white' : 'bg-white'} rounded-lg p-3 shadow`}>
                                        <p className="break-words">{msg.message}</p>
                                        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="bg-white border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
