import mongoose from "mongoose";

const loginHistorySchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  browser: String,
  os: String,
  deviceType: String,
  ipAddress: String,
  loginTime: { type: Date, default: Date.now },
});

export default mongoose.model("LoginHistory", loginHistorySchema);
