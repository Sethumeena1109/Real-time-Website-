import Post from "../models/post.js";
import Friend from "../models/friend.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content, mediaUrl, mediaType } = req.body;

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

    let limit = 1;
    if (friendsCount >= 2 && friendsCount <= 10) limit = 2;
    else if (friendsCount > 10) limit = 100;

    if (postCountToday >= limit) {
      return res.status(403).json({ message: "Daily post limit reached" });
    }

    const post = new Post({ userId, content, mediaUrl, mediaType });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
