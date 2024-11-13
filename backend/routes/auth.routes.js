import express from "express";
import {
  login,
  logout,
  register,
  getme,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoutes.js";
import { validateRequestSource } from "../middleware/requestSourceValidator.js";

const router = express.Router();

router.post("/register", validateRequestSource, register);
router.post("/login", validateRequestSource, login);
router.post("/logout", validateRequestSource, logout);
router.post("/forgot-password", validateRequestSource, forgotPassword);
router.post("/reset-password/:token", validateRequestSource, resetPassword);

router.get("/getme", validateRequestSource, protectRoute, getme);

export default router;
