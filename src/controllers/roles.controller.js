import { Role } from "../models/role.js";
import logger from "../logs/logger.js";

export async function getRoles(req, res) {
  try {
    const roles = await Role.findAll();
    res.json({ data: roles });
  } catch (error) {
    logger.error("Error en getRoles:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export async function createRole(req, res) {
  try {
    const { name, permissions } = req.body;
    const newRole = await Role.create({ name, permissions });
    res.status(201).json({ message: "Rol creado", role: newRole });
  } catch (error) {
    console.error("Error en createRole:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    role.name = name;
    role.permissions = permissions;
    await role.save();
    res.json({ message: "Rol actualizado", role });
  } catch (error) {
    console.error("Error en updateRole:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}


export async function deleteRole(req, res) {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    await role.destroy();
    res.json({ message: "Rol eliminado" });
  } catch (error) {
    console.error("Error en deleteRole:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export default {
  getRoles,
  createRole,
  updateRole,
  deleteRole
};
