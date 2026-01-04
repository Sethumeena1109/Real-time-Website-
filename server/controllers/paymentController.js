import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    const plans = {
      free: { amount: 0, limit: 1 },
      bronze: { amount: 10000, limit: 5 }, // amount in paise
      silver: { amount: 30000, limit: 10 },
      gold: { amount: 100000, limit: -1 }, // -1 means unlimited
    };

    if (!plans[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    // Payment only allowed between 10 AM to 11 AM IST
    const now = new Date();
    const istOffset = 5.5 * 60; // IST = UTC+5:30 in minutes
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const istMinutes = utcMinutes + istOffset;

    if (istMinutes < 600 || istMinutes > 660) {
      return res
        .status(403)
        .json({ message: "Payments allowed only between 10 AM and 11 AM IST" });
    }

    if (plan === "free") {
      return res.json({ message: "Free plan does not require payment" });
    }

    const options = {
      amount: plans[plan].amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ order, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
