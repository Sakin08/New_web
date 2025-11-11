import Message from "../models/Message.js";
import { generateChatId } from "../controllers/chatController.js";

// Store online users: { userId: socketId }
const onlineUsers = new Map();

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins with their userId
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} is online`);

      // Broadcast online status
      io.emit("userStatusChange", { userId, online: true });
    });

    // Join a specific chat room
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined room ${chatId}`);
    });

    // Send message
    socket.on(
      "sendMessage",
      async ({ chatId, senderId, receiverId, message }) => {
        try {
          // Save message to database
          const newMessage = await Message.create({
            chatId,
            senderId,
            receiverId,
            message,
          });

          // Populate sender info
          await newMessage.populate("senderId", "name profilePicture");
          await newMessage.populate("receiverId", "name profilePicture");

          // Emit to chat room
          io.to(chatId).emit("receiveMessage", newMessage);

          // Also emit to receiver's personal socket if they're online but not in room
          const receiverSocketId = onlineUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessageNotification", {
              chatId,
              senderId,
              message: newMessage,
            });
          }
        } catch (error) {
          socket.emit("messageError", { message: error.message });
        }
      }
    );

    // Typing indicator
    socket.on("typing", ({ chatId, userId, isTyping }) => {
      socket.to(chatId).emit("userTyping", { userId, isTyping });
    });

    // Mark messages as read
    socket.on("markAsRead", async ({ chatId, userId }) => {
      try {
        await Message.updateMany(
          { chatId, receiverId: userId, read: false },
          { read: true }
        );
        socket.to(chatId).emit("messagesRead", { chatId, userId });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("userStatusChange", { userId: socket.userId, online: false });
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
