export const postQuestion = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    const planLimits = {
      free: 1,
      bronze: 5,
      silver: 10,
      gold: -1,
    };

    const userPlan = user.subscriptionPlan || "free";
    const limit = planLimits[userPlan];

    // Unlimited plan
    if (limit === -1) {
      return res.json({ message: "Question posted successfully" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const questionsToday = await Question.countDocuments({
      userId: user._id,
      createdAt: { $gte: todayStart },
    });

    if (questionsToday >= limit) {
      return res.status(403).json({
        message: `Daily question limit reached for ${userPlan} plan`,
      });
    }

    // Create question here
    // await Question.create({ ...req.body, userId: user._id });

    res.json({ message: "Question posted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
