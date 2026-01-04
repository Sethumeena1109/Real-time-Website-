import bcrypt from "bcryptjs";

const resetRequests = {}; // in-memory store to limit once per day

export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = email || phone;
    if (!identifier) {
      return res.status(400).json({ message: "Email or phone required" });
    }

    const now = Date.now();
    if (
      resetRequests[identifier] &&
      now - resetRequests[identifier] < 24 * 60 * 60 * 1000
    ) {
      return res.status(429).json({
        message: "You can request forgot password only once a day",
      });
    }

    // Generate random password (letters only)
    const generatePassword = () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let pass = "";
      for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pass;
    };

    const newPassword = generatePassword();

    const userToUpdate = await user.findOne({ email: email });
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashpassword = await bcrypt.hash(newPassword, 12);
    userToUpdate.password = hashpassword;
    await userToUpdate.save();

    resetRequests[identifier] = now;

    // TODO: send newPassword via email or SMS - currently logged to console
    console.log(`New password for ${identifier} is: ${newPassword}`);

    res.json({ message: "Password reset successfully. Check your email or phone." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
