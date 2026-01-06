import moment from "moment-timezone";

export const accessControl = (req, res, next) => {
  const userAgent = req.headers["user-agent"]?.toLowerCase() || "";
  const nowIST = moment().tz("Asia/Kolkata");

  // Check browser
  const isChrome = userAgent.includes("chrome") && !userAgent.includes("edg");
  const isEdge = userAgent.includes("edg"); // Microsoft Edge user agent contains 'Edg'

  // Check if mobile device
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  // Rule 1: Chrome requires OTP auth (implement your OTP check here)
  if (isChrome) {
    if (!req.user || !req.user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify OTP sent to your email to access via Chrome",
      });
    }
  }

  // Rule 2: Microsoft Edge allow access without extra auth
  if (isEdge) {
    return next();
  }

  // Rule 3: Mobile device access restricted to 10 AM - 1 PM IST
  if (isMobile) {
    const hour = nowIST.hour();
    if (hour < 10 || hour >= 13) {
      return res.status(403).json({
        message: "Mobile access allowed only between 10 AM and 1 PM IST",
      });
    }
  }

  // Default allow
  next();
};
