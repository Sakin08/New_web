import mongoose from "mongoose";

const housingPostSchema = new mongoose.Schema(
  {
    rent: { type: Number, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    roommatesNeeded: { type: Number, required: true },
    phone: { type: String, required: true },
    images: [{ type: String }], // Multiple images
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("HousingPost", housingPostSchema);
