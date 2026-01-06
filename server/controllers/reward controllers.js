import User from "../models/auth.js";

// +5 points for answering a question
export const rewardForAnswer = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { points: 5 },
  });
};

// +5 points when answer reaches 5 upvotes
export const rewardForUpvotes = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { points: 5 },
  });
};

// Deduct points (answer removed / downvote)
export const deductPoints = async (userId, points) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { points: -points },
  });
};
