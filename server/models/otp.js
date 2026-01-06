import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  otpCode: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["email", "mobile"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("Otp", otpSchema);
