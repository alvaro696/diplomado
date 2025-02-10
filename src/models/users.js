import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { Task } from "./tasks.js";
import { Status } from "../constants/index.js";
import { Role } from "./role.js";
import logger from "../logs/logger.js";
import { encriptar } from "../common/bcrypt.js";

export const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "Username no puede ser nulo",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Password no puede ser null",
      },
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: Status.ACTIVE,
    validate: {
      isIn: {
        args: [[Status.ACTIVE, Status.INACTIVE]],
        msg: "El estado solo puede ser active o inactive",
      },
    },
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    },
  },
});

User.hasMany(Task);
Task.belongsTo(User);
User.belongsTo(Role, { as: "Role", foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

User.beforeCreate(async (user) => {
  try {
    user.password = await encriptar(user.password);
  } catch (error) {
    logger.error(error.message);
    throw new Error("Error al en encriptar");
  }
});
User.beforeUpdate(async (user) => {
  try {
    user.password = await encriptar(user.password);
  } catch (error) {
    logger.error(error.message);
    throw new Error("Error al en al comparar");
  }
});
