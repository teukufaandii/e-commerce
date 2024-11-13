import dotenv from "dotenv";

dotenv.config();

export const validateRequestSource = (req, res, next) => {
  const sourceHeader = req.headers["x-request-source"];
  if (sourceHeader !== process.env.REQUEST_SOURCE) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
