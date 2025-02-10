// src/models/Role.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";// Asegúrate de tener la conexión a la DB configurada

// Definición del modelo Role
export const Role = sequelize.define("users", {
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
  permissions: {
    // Almacena un arreglo de permisos (por ejemplo, ["read_user", "create_user", ...])
    // Si tu DB no soporta JSON (como MySQL anterior a 5.7), usa DataTypes.TEXT y serializa/deserializa
    type: DataTypes.JSON,
    allowNull: true,
  },
});