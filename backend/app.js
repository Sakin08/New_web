// Updated backend/app.js with backup CORS
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import buySellRoutes from "./routes/buySellRoutes.js";
import housingRoutes from "./routes/housingRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import studyGroupRoutes from "./routes/studyGroupRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

// Primary CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming origin for CORS:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/buysell", buySellRoutes);
app.use("/api/housing", housingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/study-groups", studyGroupRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/comments", commentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
