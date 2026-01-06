import User from "../models/auth.js";
import LoginHistory from "../models/loginHistory.js";
import { getUserAgentInfo } from "../utils/getUserAgentInfo.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Track login info
    const userAgentInfo = getUserAgentInfo(req);
    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    await LoginHistory.create({
      userId: user._id,
      browser: userAgentInfo.browser,
      os: userAgentInfo.os,
      deviceType: userAgentInfo.deviceType,
      ipAddress: ip,
      loginTime: new Date(),
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
