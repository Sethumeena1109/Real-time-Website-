import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import questionRoutes from "./routes/question.js";

import authMiddleware from "./middleware/authMiddleware.js";  // JWT auth check middleware
import { accessControl } from "./middleware/accessControl.js";  // Custom access rules middleware

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // update with your frontend URL
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Public routes
app.use("/auth", authRoutes);

// Protected routes - require authentication and access control
app.use("/post", authMiddleware, accessControl, postRoutes);
app.use("/question", authMiddleware, accessControl, questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
