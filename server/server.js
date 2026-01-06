import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import friendRoutes from "./routes/friend.js";
import paymentRoutes from "./routes/payment.js";
import postRoutes from "./routes/post.js";
import questionRoutes from "./routes/question.js";
import rewardRoutes from "./routes/reward.js";
import otpRoutes from "./routes/otp.js"; // Added OTP routes

dotenv.config();

const app = express();

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Register routes
app.use("/auth", authRoutes);
app.use("/friends", friendRoutes);
app.use("/payment", paymentRoutes);
app.use("/posts", postRoutes);
app.use("/questions", questionRoutes);
app.use("/rewards", rewardRoutes);
app.use("/otp", otpRoutes); // OTP route registration

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
