import { Role } from "../models/role.js";
import { Permission } from "../models/permission.js";
import logger from "../logs/logger.js";

export async function getRoles(req, res) {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: "permissions", // Debe coincidir con el alias definido en la asociación
          attributes: ["name"], // Solo obtenemos el nombre del permiso
        },
      ],
    });

    // Mapear cada rol para que incluya la propiedad "permissions" como un arreglo de nombres
    const data = roles.map((role) => {
      const roleJson = role.toJSON();
      return {
        ...roleJson,
        permissions: roleJson.permissions
          ? roleJson.permissions.map((perm) => perm.name)
          : [],
      };
    });

    res.json({ data, total: data.length });
  } catch (error) {
    logger.error("Error en getRoles:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export async function createRole(req, res) {
  try {
    const { name, permissions } = req.body;

    // Verifica si el rol ya existe
    const [role, created] = await Role.findOrCreate({
      where: { name },
      defaults: {},
    });

    if (!created) {
      return res.status(400).json({ message: `El rol "${name}" ya existe.` });
    }

    if (permissions && Array.isArray(permissions)) {
      // Buscar los permisos en la base de datos usando sus nombres
      const perms = await Permission.findAll({ where: { name: permissions } });
      await role.setPermissions(perms);
    }
    res.status(201).json({ message: "Rol creado correctamente", role });
  } catch (error) {
    console.error("Error en createRole:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body; // Se espera que "permissions" sea un arreglo, por ejemplo: ["read_user", "update_user"]

    // Buscar el rol a actualizar
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Actualizar el nombre del rol
    role.name = name;
    await role.save();

    // Actualizar la asociación de permisos
    if (permissions && Array.isArray(permissions)) {
      // Aquí suponemos que "permissions" es un arreglo de nombres.
      // Si en tu API envías IDs, ajusta la consulta a { where: { id: permissions } }.
      const perms = await Permission.findAll({ where: { name: permissions } });
      await role.setPermissions(perms);
    }

    // Volver a obtener el rol con los permisos actualizados para enviarlo en la respuesta
    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: "permissions",
          attributes: ["name"],
        },
      ],
    });

    res.json({ message: "Rol actualizado", role: updatedRole });
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
  deleteRole,
};
