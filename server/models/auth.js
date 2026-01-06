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
  points: {
    type: Number,
    default: 0,
  },
  preferredLanguage: {
    type: String,
    default: "English",
    enum: ["Spanish", "Hindi", "Portuguese", "Chinese", "French", "English"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  mobileNumber: {
    type: String,
  },
});

export default mongoose.model("user", userSchema);
