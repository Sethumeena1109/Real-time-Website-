import Post from "../models/post.js";
import Friend from "../models/friend.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;

    const friendsCount = await Friend.countDocuments({ userId });

    if (friendsCount === 0) {
      return res.status(403).json({ message: "Add friends to post" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postCountToday = await Post.countDocuments({
      userId,
      createdAt: { $gte: today }
    });

    if (
      (friendsCount < 2 && postCountToday >= 1) ||
      (friendsCount >= 2 && friendsCount < 10 && postCountToday >= friendsCount)
    ) {
      return res.status(403).json({ message: "Daily post limit reached" });
    }

    const post = new Post({ userId, content });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
