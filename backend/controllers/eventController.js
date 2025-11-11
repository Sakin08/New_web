import Event from "../models/Event.js";
import { uploadImage } from "../services/cloudinaryService.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const createEvent = [
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { title, description, date, location } = req.body;

      if (!title || !description || !date || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = await Promise.all(
          req.files.map((file) => uploadImage(file))
        );
      }

      const event = await Event.create({
        title,
        description,
        date,
        location,
        images: imageUrls,
        user: req.user._id,
      });

      await event.populate("user", "name email profilePicture");
      res.status(201).json(event);
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ message: error.message });
    }
  },
];

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("user", "name email profilePicture")
      .populate("interested", "name")
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const markInterested = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userId = req.user._id;
    const isInterested = event.interested.includes(userId);

    if (isInterested) {
      // Remove user from interested list
      event.interested = event.interested.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add user to interested list
      event.interested.push(userId);
    }

    await event.save();
    await event.populate("user", "name email profilePicture");

    res.json(event);
  } catch (error) {
    console.error("Interest update error:", error);
    res.status(500).json({ message: error.message });
  }
};
