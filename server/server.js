import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import paymentRoutes from "./routes/payment.js";
import friendRoutes from "./routes/friend.js";
import questionRoutes from "./routes/question.js";
import loginHistoryRoutes from "./routes/loginHistory.js";  // New

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // your frontend URL
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/payment", paymentRoutes);
app.use("/friend", friendRoutes);
app.use("/question", questionRoutes);
app.use("/login-history", loginHistoryRoutes);  // New route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
