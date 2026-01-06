import UAParser from "ua-parser-js";

export const getUserAgentInfo = (req) => {
  const ua = req.headers["user-agent"];
  const parser = new UAParser(ua);
  const result = parser.getResult();

  return {
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    deviceType: result.device.type || "desktop", // mobile, tablet, desktop
    userAgent: ua,
  };
};
