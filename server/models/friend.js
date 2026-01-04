import mongoose from "mongoose";

const friendSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending"
  }
});

export default mongoose.model("friend", friendSchema);
