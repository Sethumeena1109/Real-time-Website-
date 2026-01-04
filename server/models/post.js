import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  content: {
    type: String
  },

  mediaUrl: {
    type: String
  },

  mediaType: {
    type: String,
    enum: ["image", "video"]
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],

  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("post", postSchema);
