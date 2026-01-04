import Friend from "../models/friend.js";

export const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  const friend = await Friend.create({
    userId,
    friendId,
    status: "accepted"
  });

  res.json(friend);
};

export const getFriends = async (req, res) => {
  const friends = await Friend.find({
    userId: req.params.userId,
    status: "accepted"
  });

  res.json(friends);
};
