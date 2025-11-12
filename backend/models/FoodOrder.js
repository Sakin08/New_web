import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema(
  {
    restaurant: { type: String, required: true },
    description: { type: String, required: true },
    orderType: {
      type: String,
      enum: ["group-order", "meal-sharing", "restaurant-review"],
      required: true,
    },
    deliveryLocation: { type: String },
    orderTime: { type: Date },
    totalCost: { type: Number },
    maxParticipants: { type: Number, default: 0 },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        contribution: { type: Number },
        items: { type: String },
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "ordered", "delivered"],
      default: "open",
    },
    image: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    cuisine: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("FoodOrder", foodOrderSchema);
