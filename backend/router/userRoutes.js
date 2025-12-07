import express from 'express';
import { register, login, getProfile, logout, fetchLeaderboard, verifyAccount, resendOtp} from "../controllers/userController.js";
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/leaderboard", fetchLeaderboard);
router.post("/verify", verifyAccount); // No authentication required for verification
router.post("/resend-otp", resendOtp); // Resend OTP endpoint

export default router;
