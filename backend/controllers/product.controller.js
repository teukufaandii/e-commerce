import db from "../models/index.js";
const { Products, Categories } = db;

import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const adminAddProduct = async (req, res) => {
  const { name, price, description, picture, discount_type, discount_value } = req.body;

  try {
    const id_gen = "prod" + Date.now();

    const category_id = req.body.category_id;
    const validate_category = await Categories.findOne({
      where: { id: category_id },
    });

    if (!validate_category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const description_length = description.length;
    if (description_length > 1000) {
      return res
        .status(400)
        .json({ message: "Description must not exceed 1000 characters" });
    }

    const discount_types = discount_type.toLowerCase();

    if (discount_type !== "percentage" && discount_type !== "fixed") {
      return res
        .status(400)
        .json({ message: "Discount type must be 'percentage' or 'fixed'" });
    }

    if (discount_value < 0) {
      return res
        .status(400)
        .json({ message: "Discount value must not be negative" });
    }

    if (discount_type === "percentage" && discount_value > 100) {
      return res
        .status(400)
        .json({ message: "Discount percentage must not exceed 100%" });
    }

    if (discount_type === "fixed" && discount_value > price) {
      return res
        .status(400)
        .json({ message: "Discount value must not exceed product price" });
    }

    const existingProduct = await Products.findOne({ where: { name } });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price must not be negative" });
    }

    if (discount_type && !discount_value) {
      return res.status(400).json({ message: "Discount value is required" });
    }

    if (!picture || !picture.startsWith("data:image/")) {
        return res
          .status(400)
          .json({ message: "Image file is required in Base64 format" });
      }
  
      const base64Image = picture.split(";base64,").pop();
  
      const result = await cloudinary.v2.uploader.upload(
        `data:image/png;base64,${base64Image}`
      );

    const createdProduct = await Products.create({
        id: id_gen,
        name,
        category_id,
        price,
        description,
        picture: result.secure_url,
        discount_type: discount_types,
        discount_value,
      });

    return res
      .status(200)
      .json({ message: "Product created successfully", createdProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
