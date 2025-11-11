import express from "express";
import {
  createEvent,
  getEvents,
  markInterested,
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/index.js"; // Now valid

const router = express.Router();

router.post("/", protect, createEvent); // Any logged-in user can create
router.get("/", getEvents);
router.patch("/:id/interested", protect, markInterested);
export default router;
