import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import questionRoutes from "./routes/question.js";

import authMiddleware from "./middleware/authMiddleware.js";  // Your auth check middleware
import { accessControl } from "./middleware/accessControl.js";  // Your custom access rules

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Public routes (no login required)
app.use("/auth", authRoutes);

// Protected routes — user must be logged in and pass accessControl middleware

app.use("/post", authMiddleware, accessControl, postRoutes);
app.use("/question", authMiddleware, accessControl, questionRoutes);

// Other routes...

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
