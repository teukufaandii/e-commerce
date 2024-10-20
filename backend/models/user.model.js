import { Sequelize } from "sequelize";
import { sequelize } from "../db/mysqlConnect.js";

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
  failedAttempts: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  lastFailedAttempt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("User table created successfully"))
  .catch((error) => console.error("Unable to create table : ", error));
