import api from "./axios.js";

export const chatApi = {
  getChatHistory: (userId) => api.get(`/chat/${userId}`),
  getRecentChats: () => api.get("/chat/recent"),
  getUnreadCount: () => api.get("/chat/unread-count"),
};

export default chatApi;
