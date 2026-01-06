import LoginHistory from "../models/loginHistory.js";

export const getLoginHistory = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const history = await LoginHistory.find({ userId }).sort({ loginTime: -1 });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
