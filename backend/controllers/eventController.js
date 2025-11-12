import Event from "../models/Event.js";
import { uploadImage } from "../services/cloudinaryService.js";
import { createNotification } from "./notificationController.js";
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

      // Parse additional fields
      const capacity = req.body.capacity ? parseInt(req.body.capacity) : 0;
      const requiresRSVP = req.body.requiresRSVP === "true";
      const waitlistEnabled = req.body.waitlistEnabled === "true";
      const category = req.body.category || "other";

      const eventData = {
        title,
        description,
        date,
        location,
        images: imageUrls,
        user: req.user._id,
        capacity,
        requiresRSVP,
        waitlistEnabled,
        category,
      };

      // Parse coordinates if provided
      if (req.body.coordinates) {
        try {
          eventData.coordinates = JSON.parse(req.body.coordinates);
        } catch (e) {
          console.error("Failed to parse coordinates:", e);
        }
      }

      // Parse tags if provided
      if (req.body.tags) {
        try {
          eventData.tags = JSON.parse(req.body.tags);
        } catch (e) {
          console.error("Failed to parse tags:", e);
        }
      }

      const event = await Event.create(eventData);

      await event.populate("user", "name email profilePicture");

      // Emit real-time event creation
      const io = req.app.get("io");
      if (io) {
        io.to("events").emit("eventUpdate", { type: "created", data: event });

        // Broadcast notification to all connected users
        io.emit("newNotification", {
          type: "event_created",
          title: "New Event Posted",
          message: `${req.user.name} posted: ${event.title}`,
          link: `/events`,
          data: { eventId: event._id },
        });
      }

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
    await event.populate("interested", "name");

    // Emit real-time interest update
    const io = req.app.get("io");
    if (io) {
      io.to("events").emit("eventUpdate", {
        type: "interestUpdated",
        data: {
          eventId: event._id,
          interestedCount: event.interested.length,
          event: event,
        },
      });
    }

    res.json(event);
  } catch (error) {
    console.error("Interest update error:", error);
    res.status(500).json({ message: error.message });
  }
};
