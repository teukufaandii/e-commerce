import db from "../models/index.js";
import jwt from "jsonwebtoken";

const { Users } = db;

export const adminRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.user?.id;

    const admin = decoded.user?.role;

    if (!id) {
        return res.status(401).json({ msg: "Unauthorized: Invalid token payload", });
      }

    if (admin !== "admin") {
        return res.status(403).json({ msg: "Forbidden: You are not an admin" });
    }

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized: Users not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Unauthorized: Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }
    console.log("Error in protectRoute middleware", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
