import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import paymentroutes from "./routes/payment.js";
import authroutes from "./routes/auth.js";
import userroutes from "./routes/auth.js";
import questionroute from "./routes/question.js";
import answerroutes from "./routes/answer.js";
import postRoutes from "./routes/post.js";
import friendRoutes from "./routes/friend.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/payment", paymentroutes);
app.use("/auth", authroutes);
app.use("/user", userroutes);
app.use("/question", questionroute);
app.use("/answer", answerroutes);
app.use("/post", postRoutes);
app.use("/friend", friendRoutes);

const PORT = process.env.PORT || 5000;
const databaseurl = process.env.MONGODB_URL;

mongoose
  .connect(databaseurl)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
