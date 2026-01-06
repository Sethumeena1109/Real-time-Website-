import express from "express";
import { transferPoints } from "../controllers/rewardController.js";

const router = express.Router();

router.post("/transfer", transferPoints);

export default router;
