import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  tags: {
    type: [String],
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  subscriptionPlan: {
    type: String,
    default: "free",
  },
});

export default mongoose.model("user", userSchema);
