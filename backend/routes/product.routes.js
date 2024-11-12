import express from "express";
import { protectRoute } from "../middleware/protectRoutes.js";
import { adminRoutes } from "../middleware/adminRoutes.js";
import { adminAddProduct } from "../controllers/product.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
      file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
  });
  
  const upload = multer({ storage: storage });

//user routes

//guest routes

//admin routes
router.post("/add", protectRoute, adminRoutes, upload.single("picture"), adminAddProduct);

export default router;