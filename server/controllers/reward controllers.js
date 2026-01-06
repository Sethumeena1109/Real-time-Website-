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

// Transfer points between users
export const transferPoints = async (req, res) => {
  const { senderId, receiverEmail, pointsToTransfer } = req.body;

  if (pointsToTransfer <= 0) {
    return res.status(400).json({ message: "Transfer amount must be positive" });
  }

  try {
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    if (sender.points < 10) {
      return res.status(403).json({ message: "You need at least 10 points to transfer" });
    }

    if (sender.points < pointsToTransfer) {
      return res.status(403).json({ message: "Insufficient points to transfer" });
    }

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    // Deduct from sender
    sender.points -= pointsToTransfer;
    await sender.save();

    // Add to receiver
    receiver.points += pointsToTransfer;
    await receiver.save();

    res.status(200).json({ message: `Transferred ${pointsToTransfer} points to ${receiver.email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
