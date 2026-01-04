import express from "express";
import { Signup, Login, forgotPassword, getallusers, updateprofile } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forgot-password", forgotPassword);
router.get("/users", getallusers);
router.patch("/updateprofile/:id", updateprofile);

export default router;
