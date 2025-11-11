import express from "express";
import {
  getChatHistory,
  getRecentChats,
  getUnreadCount,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/recent", protect, getRecentChats);
router.get("/unread-count", protect, getUnreadCount);
router.get("/:userId", protect, getChatHistory);

export default router;
