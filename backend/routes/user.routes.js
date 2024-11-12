import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import { getUserBySlug } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:slug", getUserBySlug);

export default router;