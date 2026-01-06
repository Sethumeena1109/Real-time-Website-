import express from "express";
import { Askanswer, deleteanswer, upvoteAnswer, postQuestion } from "../controllers/questionController.js";

const router = express.Router();

// Post a question (you might already have this in another file, if yes, adjust accordingly)
router.post("/post", postQuestion);

// Add an answer to a question
router.post("/:id/answer", Askanswer);

// Delete an answer from a question
router.delete("/:id/answer", deleteanswer);

// Upvote an answer
router.post("/:questionId/answers/:answerId/upvote", upvoteAnswer);

export default router;
