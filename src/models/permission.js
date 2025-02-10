// src/models/Permission.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js"; // Asegúrate de tener tu conexión configurada

// Definición del modelo Permission
export const Permission = sequelize.define("permissions", {
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
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

