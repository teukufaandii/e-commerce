import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import { adminRoutes } from "../middleware/adminRoutes.js";
import { adminAddCategory } from "../controllers/category.controller.js";
import { validateRequestSource } from "../middleware/requestSourceValidator.js";

const router = express.Router();

router.post("/add", validateRequestSource, protectRoute, adminRoutes, adminAddCategory);

// router.get("/:slug", getUserBySlug);

export default router;