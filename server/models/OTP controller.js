import Otp from "../models/otp.js";
import User from "../models/auth.js";
import nodemailer from "nodemailer";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const requestOTP = async (req, res) => {
  try {
    const { userId, preferredLanguage, email, mobileNumber } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let otpType;
    if (preferredLanguage === "French") {
      if (!email) return res.status(400).json({ message: "Email required for French verification" });
      otpType = "email";
    } else {
      if (!mobileNumber) return res.status(400).json({ message: "Mobile number required for this language" });
      otpType = "mobile";
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save OTP to DB
    await Otp.findOneAndUpdate(
      { userId, type: otpType },
      { otpCode, expiresAt },
      { upsert: true, new: true }
    );

    // Send OTP
    if (otpType === "email") {
      await sendEmailOTP(email, otpCode);
    } else {
      // TODO: Implement SMS sending here
      // For now, just console.log for testing
      console.log(`Send SMS OTP ${otpCode} to mobile number ${mobileNumber}`);
    }

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otpCode, type, preferredLanguage, mobileNumber } = req.body;

    if (!userId || !otpCode || !type || !preferredLanguage) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const otpRecord = await Otp.findOne({ userId, type });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpRecord.otpCode !== otpCode) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update user verification & preferred language
    const updateFields = { preferredLanguage };
    if (type === "email") {
      updateFields.isEmailVerified = true;
    } else {
      updateFields.isMobileVerified = true;
      if (mobileNumber) {
        updateFields.mobileNumber = mobileNumber;
      }
    }

    await User.findByIdAndUpdate(userId, updateFields);

    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "OTP verified and language updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
