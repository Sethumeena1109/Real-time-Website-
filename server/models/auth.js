import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  tags: {
    type: [String]
  },
  points: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("user", userSchema);
