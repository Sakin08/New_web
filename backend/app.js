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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
