import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post(
  "/upload-profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);

export default router;
