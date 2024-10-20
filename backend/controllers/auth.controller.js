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
    };

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const currentTime = new Date();

    if (user.lastFailedAttempt) {
      const timeDifference = currentTime - new Date(user.lastFailedAttempt);
      const tenMinutesInMillis = 10 * 60 * 1000;

      if (timeDifference >= tenMinutesInMillis) {
        await User.update({ failedAttempts: 0 }, { where: { email } });
        user.failedAttempts = 0;
      }
    }

    if (user.failedAttempts >= 5) {
      return res.status(403).json({
        message:
          "Too many failed attempts. Account is temporarily locked. Please try again later.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await User.update(
        {
          failedAttempts: user.failedAttempts + 1,
          lastFailedAttempt: currentTime,
        },
        { where: { email } }
      );

      if (user.failedAttempts + 1 >= 5) {
        return res.status(403).json({
          message:
            "Too many failed attempts. Account is temporarily locked. Please try again later.",
        });
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (passwordMatch && user.failedAttempts > 0) {
      await User.update(
        { failedAttempts: 0, lastFailedAttempt: null },
        { where: { email } }
      );
    }

    generateTokenAndSetCookies(user, res);

    const userWithoutSensitiveData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "User logged in successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in user logout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
