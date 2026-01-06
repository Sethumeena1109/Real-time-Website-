import express from "express";
import { getLoginHistory } from "../controllers/loginHistoryController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // your existing auth middleware

const router = express.Router();

router.get("/", authMiddleware, getLoginHistory);

export default router;
