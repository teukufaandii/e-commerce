import db from "../models/index.js";
const { Users } = db;

export const getUserBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const user = await Users.findOne({ where: { slug } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithoutSensitiveData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    return res.json(userWithoutSensitiveData);
  } catch (error) {}
};
