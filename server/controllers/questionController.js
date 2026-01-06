import mongoose from "mongoose";
import question from "../models/question.js";
import { rewardForAnswer, deductPoints, rewardForUpvotes } from "./rewardController.js";

export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  const { noofanswer, answerbody, useranswered, userid } = req.body;
  updatenoofanswer(_id, noofanswer);

  try {
    const updatequestion = await question.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerbody, useranswered, userid }] },
    });

    // Reward points for answering
    await rewardForAnswer(userid);

    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

const updatenoofanswer = async (_id, noofanswer) => {
  try {
    await question.findByIdAndUpdate(_id, { $set: { noofanswer: noofanswer } });
  } catch (error) {
    console.log(error);
  }
};

export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noofanswer, answerid, userid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(400).json({ message: "answer unavailable" });
  }
  updatenoofanswer(_id, noofanswer);
  try {
    const updatequestion = await question.updateOne(
      { _id },
      {
        $pull: { answer: { _id: answerid } },
      }
    );

    // Deduct points for deleting answer
    await deductPoints(userid, 5);

    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

export const upvoteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const { userId } = req.body; // user who is upvoting

  if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(400).json({ message: "Invalid question or answer ID" });
  }

  try {
    const questionDoc = await question.findById(questionId);
    if (!questionDoc) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find the answer inside question
    const answer = questionDoc.answer.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Initialize upvotes array if not present
    if (!answer.upvotes) answer.upvotes = [];

    // Prevent the same user from upvoting multiple times
    if (answer.upvotes.includes(userId)) {
      return res.status(400).json({ message: "User already upvoted" });
    }

    // Add userId to upvotes array
    answer.upvotes.push(userId);

    // Save updated question document
    await questionDoc.save();

    // Reward user if upvotes reach 5
    if (answer.upvotes.length === 5) {
      await rewardForUpvotes(answer.userid); // answer.userid is owner of the answer
    }

    res.status(200).json({ message: "Upvoted successfully", upvotesCount: answer.upvotes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
