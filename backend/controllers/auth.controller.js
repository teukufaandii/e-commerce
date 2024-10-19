import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../libs/utils/generateCookies.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookies(newUser, res);

    const userWithoutSensitiveData = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return res
      .status(201)
      .json({
        message: "User created successfully",
        user: userWithoutSensitiveData,
      });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
