import express from 'express';
import { createEvent, getEvents } from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/index.js'; // Now valid

const router = express.Router();

router.post('/', protect, adminOnly, createEvent);
router.get('/', getEvents);

export default router;