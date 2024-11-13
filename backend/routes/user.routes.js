import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import { getUserBySlug } from "../controllers/user.controller.js";
import { validateRequestSource } from "../middleware/requestSourceValidator.js";

const router = express.Router();

router.get("/:slug", validateRequestSource, getUserBySlug);

export default router;