import Message from "../models/Message.js";

// Generate deterministic chatId
export const generateChatId = (userId1, userId2) => {
  return [userId1, userId2].sort().join(":");
};

// Get chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();
    const chatId = generateChatId(currentUserId, userId);

    const messages = await Message.find({ chatId })
      .populate("senderId", "name profilePicture")
      .populate("receiverId", "name profilePicture")
      .sort({ createdAt: 1 })
      .limit(100); // Last 100 messages

    // Mark messages as read
    await Message.updateMany(
      { chatId, receiverId: currentUserId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all recent chats for current user
export const getRecentChats = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    // Get all messages involving current user
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    })
      .populate("senderId", "name profilePicture")
      .populate("receiverId", "name profilePicture")
      .sort({ createdAt: -1 });

    // Group by chatId and get latest message for each chat
    const chatMap = new Map();

    for (const msg of messages) {
      if (!chatMap.has(msg.chatId)) {
        const otherUser =
          msg.senderId._id.toString() === currentUserId
            ? msg.receiverId
            : msg.senderId;

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          chatId: msg.chatId,
          receiverId: currentUserId,
          read: false,
        });

        chatMap.set(msg.chatId, {
          chatId: msg.chatId,
          otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount,
        });
      }
    }

    const recentChats = Array.from(chatMap.values());
    res.json(recentChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
