import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";
const router = express.Router();

router.post("/add", addFriend);
router.get("/:userId", getFriends);

export default router;
