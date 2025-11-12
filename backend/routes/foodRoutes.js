import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createFoodOrder,
  getFoodOrders,
  getFoodOrderById,
  joinFoodOrder,
  updateOrderStatus,
  deleteFoodOrder,
} from "../controllers/foodController.js";

const router = express.Router();

router.post("/", protect, createFoodOrder);
router.get("/", getFoodOrders);
router.get("/:id", getFoodOrderById);
router.post("/:id/join", protect, joinFoodOrder);
router.patch("/:id/status", protect, updateOrderStatus);
router.delete("/:id", protect, deleteFoodOrder);

export default router;
