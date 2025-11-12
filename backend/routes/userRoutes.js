import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getUserProfile,
  updateProfile,
  followUser,
  createReview,
  getUserReviews,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/:id/follow", protect, followUser);
router.post("/reviews", protect, createReview);
router.get("/:id/reviews", getUserReviews);

export default router;
