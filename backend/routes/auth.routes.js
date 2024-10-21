import express from "express";
import { login, logout, register, getme } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/getme", protectRoute, getme);

export default router;