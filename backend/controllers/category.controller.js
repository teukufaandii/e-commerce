import { randomBytes } from "crypto";
import db from "../models/index.js";
const { Categories } = db;

export const adminAddCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category_id = "category_" + randomBytes(8).toString("hex");

    const slug = name.replace(/\s+/g, "-").toLowerCase();

    const existingCategory = await Categories.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Categories.create({ name, slug, id: category_id });
    return res
      .status(200)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error by adminAddCategory Controller" });
  }
};
