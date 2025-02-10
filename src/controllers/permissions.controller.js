import { Role } from "../models/role.js";
import { Permission } from "../models/permission.js";

import logger from "../logs/logger.js";
// src/controllers/permissions.js

// Listar permisos
async function getPermissions(req, res) {
  try {
    const permissions = await Permission.findAll();
    res.json({ data: permissions });
  } catch (error) {
    console.error("Error en getPermissions:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// Crear un permiso
async function createPermission(req, res) {
  try {
    const { name, description } = req.body;
    const newPermission = await Permission.create({ name, description });
    res
      .status(201)
      .json({ message: "Permiso creado", permission: newPermission });
  } catch (error) {
    console.error("Error en createPermission:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar un permiso
async function updatePermission(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    permission.name = name;
    permission.description = description;
    await permission.save();
    res.json({ message: "Permiso actualizado", permission });
  } catch (error) {
    console.error("Error en updatePermission:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// Eliminar un permiso
async function deletePermission(req, res) {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    await permission.destroy();
    res.json({ message: "Permiso eliminado" });
  } catch (error) {
    console.error("Error en deletePermission:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export default {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
};
