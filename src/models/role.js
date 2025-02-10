// src/models/Role.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { Permission } from "./permission.js";

export const Role = sequelize.define("roles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});


// Definir la asociación muchos a muchos usando un alias
Role.belongsToMany(Permission, { 
  through: "RolePermissions", 
  foreignKey: "roleId", 
  as: "permissions" 
});
Permission.belongsToMany(Role, { 
  through: "RolePermissions", 
  foreignKey: "permissionId", 
  as: "roles" 
});