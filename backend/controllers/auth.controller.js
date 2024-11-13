import db from "../models/index.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../libs/utils/generateCookies.js";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../libs/utils/emailService.js";
import crypto from "crypto";

const { Users, Credentials } = db;

export const register = async (req, res) => {
  const { name, email, password, phone: userPhone } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const phoneRegex = /^(628|08)\d{8,12}$/;
    const cleanedPhone = userPhone.trim();
    if (!phoneRegex.test(cleanedPhone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const existingPhone = await Users.findOne({
      where: { phone: cleanedPhone },
    });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = uuidv4();

    let slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    let uniqueSlug = slug;

    while (await Users.findOne({ where: { slug: uniqueSlug } })) {
      const randomNumber = Math.floor(Math.random() * 10000);
      uniqueSlug = `${slug}-${randomNumber}`;
    }

    const userPhoneFinal = cleanedPhone.toString();

    const newUser = await Users.create({
      id: userId,
      name,
      slug: uniqueSlug,
      email,
      phone: userPhoneFinal,
    });

    await Credentials.create({
      user_id: userId,
      hasher: "bcrypt",
      password_hash: hashedPassword,
      password_salt: salt,
    });

    generateTokenAndSetCookies(newUser, res);

    const userWithoutSensitiveData = {
      id: newUser.userId,
      name: newUser.name,
      phone: newUser.phone,
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
  const { email, password: inputPassword } = req.body; // Renamed password to inputPassword to avoid conflict
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const credentials = await Credentials.findOne({
      where: { user_id: user.id },
    });

    if (!credentials) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(
      inputPassword,
      credentials.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateTokenAndSetCookies(user, res);

    const userWithoutSensitiveData = {
      userId: user.userId,
      name: user.name,
      phone: user.phone,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login successful",
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
    return res.status(200).json({ message: "Users logged out successfully" });
  } catch (error) {
    console.error("Error in user logout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getme = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.user.id } });

    const userWithoutSensitiveData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    return res.status(200).json({
      message: "Users retrieved successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error in user getme:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).send("Email not found");
    }

    const credentials = await Credentials.findOne({
      where: { user_id: user.id },
    });

    if (
      credentials.passwordToken &&
      credentials.passwordTokenExpiration > Date.now()
    ) {
      return res
        .status(400)
        .send("You have already requested a password reset.");
    } else if (
      credentials.passwordToken &&
      credentials.passwordTokenExpiration < Date.now()
    ) {
      await Credentials.update(
        {
          passwordToken: null,
          passwordTokenExpiration: null,
        },
        { where: { user_id: user.id } }
      );
    }

    if (!credentials) {
      return res.status(404).send("User  not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await Credentials.update(
      {
        passwordToken: resetToken,
        passwordTokenExpiration: Date.now() + 3600000,
      },
      { where: { user_id: user.id } }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset",
      `Click here to reset your password: ${resetUrl}`
    );

    res.status(200).send("Password reset link sent to your email.");
  } catch (error) {
    console.error("Error in sending password reset email:", error);
    return res.status(500).send("Server error");
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.params;

  if (!token) {
    return res.status(404).send("Token is required");
  }
  try {
    const userCredential = await Credentials.findOne({
      where: { passwordToken: token },
    });

    if (!userCredential || userCredential.passwordTokenExpiration < Date.now()) {
      return res.status(400).send("Invalid or expired token");
    }

    const user = await Users.findOne({ where: { id: userCredential.user_id } });

    if (!user) {
      return res.status(404).send("User  not found");
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const matchOldPassword = await bcrypt.compare(
      newPassword,
      userCredential.password_hash
    );
    if (matchOldPassword) {
      return res
        .status(400)
        .send("New password cannot be the same as the old one");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Credentials.update(
      {
        password_hash: hashedPassword,
        password_salt: salt,
        passwordToken: null,
        passwordTokenExpiration: null,
      },
      { where: { user_id: user.id } }
    );

    res.status(200).send("Password has been reset successfully.");
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).send("Server error");
  }
};
