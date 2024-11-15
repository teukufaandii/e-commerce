import express from "express";
import {
  login,
  logout,
  register,
  getme,
  forgotPassword,
  resetPassword,
  sendOtpByPhone,
  verifyOtpByPhone,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoutes.js";
import { validateRequestSource } from "../middleware/requestSourceValidator.js";

const router = express.Router();

router.post("/register", validateRequestSource, register);
router.post("/login", validateRequestSource, login);
router.post("/logout", validateRequestSource, logout);
router.post("/forgot-password", validateRequestSource, forgotPassword);
router.post("/reset-password/:token", validateRequestSource, resetPassword);
router.post("/phone/send-otp", validateRequestSource, protectRoute, sendOtpByPhone);
router.post("/phone/verify-otp", validateRequestSource, protectRoute, verifyOtpByPhone);
// router.post("/mail/send-otp", validateRequestSource, protectRoute, sendOtpByEmail);
// router.post("/mail/verify-otp", validateRequestSource, protectRoute, verifyOtpByEmail);

router.get("/getme", validateRequestSource, protectRoute, getme);

export default router;
