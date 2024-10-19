import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

export const User = sequelize.define("users", {
  userId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(255),
  },
  email: {
    type: Sequelize.STRING(255),
    unique: true,
  },
  password: {
    type: Sequelize.STRING(255),
  },
  role: {
    type: Sequelize.STRING(255),
    defaultValue: "user",
  },
});

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });
