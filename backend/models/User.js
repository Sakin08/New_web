import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    role: { type: String, enum: ["student", "admin"], default: "student" },

    // Social Features
    bio: { type: String, default: "", maxlength: 500 },
    interests: [{ type: String }],
    phone: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Verification & Safety
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    studentId: { type: String },
    isStudentVerified: { type: Boolean, default: false },

    // Reputation
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    reputationPoints: { type: Number, default: 0 },
    badges: [{ type: String }],

    // Safety
    reportedCount: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
