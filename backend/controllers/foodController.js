import FoodOrder from "../models/FoodOrder.js";
import { uploadImage } from "../services/cloudinaryService.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const createFoodOrder = [
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        restaurant,
        description,
        orderType,
        deliveryLocation,
        orderTime,
        totalCost,
        maxParticipants,
        cuisine,
        rating,
      } = req.body;

      let imageUrl = null;
      if (req.file) {
        imageUrl = await uploadImage(req.file);
      }

      const foodOrder = await FoodOrder.create({
        restaurant,
        description,
        orderType,
        deliveryLocation,
        orderTime,
        totalCost,
        maxParticipants: maxParticipants || 0,
        cuisine,
        rating,
        image: imageUrl,
        organizer: req.user._id,
      });

      await foodOrder.populate("organizer", "name email profilePicture");
      res.status(201).json(foodOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const getFoodOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.find()
      .populate("organizer", "name email profilePicture")
      .populate("participants.user", "name profilePicture")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodOrderById = async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id)
      .populate("organizer", "name email profilePicture")
      .populate("participants.user", "name profilePicture");

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinFoodOrder = async (req, res) => {
  try {
    const { contribution, items } = req.body;
    const order = await FoodOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    if (order.status !== "open") {
      return res.status(400).json({ message: "Order is closed" });
    }

    const alreadyJoined = order.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined" });
    }

    if (
      order.maxParticipants > 0 &&
      order.participants.length >= order.maxParticipants
    ) {
      return res.status(400).json({ message: "Order is full" });
    }

    order.participants.push({
      user: req.user._id,
      contribution,
      items,
    });

    await order.save();
    await order.populate("organizer", "name email profilePicture");
    await order.populate("participants.user", "name profilePicture");

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await FoodOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    if (order.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFoodOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    if (order.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await order.deleteOne();
    res.json({ message: "Food order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
