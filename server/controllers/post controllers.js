import Post from "../models/post.js";
import Friend from "../models/friend.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content, mediaUrl, mediaType } = req.body;

    const friendsCount = await Friend.countDocuments({
      userId,
      status: "accepted"
    });

    if (friendsCount === 0)
      return res.status(403).json({ message: "No friends, cannot post" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPosts = await Post.countDocuments({
      userId,
      createdAt: { $gte: today }
    });

    let limit = 1;
    if (friendsCount >= 2) limit = 2;
    if (friendsCount > 10) limit = 100;

    if (todayPosts >= limit)
      return res.status(403).json({ message: "Daily post limit reached" });

    const post = await Post.create({
      userId,
      content,
      mediaUrl,
      mediaType
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};
