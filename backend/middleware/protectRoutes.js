import db from "../models/index.js";
import jwt from "jsonwebtoken";

const { Users } = db;

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded.user?.id;

    if (!id) {
      return res.status(401).json({ msg: "Unauthorized: Invalid token payload", });
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
