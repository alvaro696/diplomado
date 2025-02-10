import { User } from "../models/users.js";
import { Task } from "../models/tasks.js";
import { Role } from "../models/role.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";
import { Op } from "sequelize";

async function getUsers(req, res) {
  logger.info("llega peticion listar usuarios");
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      status: Status.ACTIVE,
    };

    if (search) {
      whereClause.username = {
        [Op.like]: `%${search}%`,
      };
    }

    const result = await User.findAndCountAll({
      attributes: ["id", "username", "password", "status", "roleId"],
      include: [
        {
          model: Role,
          as: "Role", // Asegúrate de que coincide con la asociación definida en User
          attributes: ["name"],
        },
      ],
      where: whereClause,
      order: [["id", "DESC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Mapeamos cada usuario para agregar la propiedad "role"
    const data = result.rows.map((user) => {
      const userJson = user.toJSON();
      return {
        ...userJson,
        role: userJson.Role ? userJson.Role.name : "No asignado",
      };
    });

    res.json({
      data,
      total: result.count,
    });
  } catch (error) {
    logger.error("error getuser " + error);
    res.status(500).json({ message: "server error" });
  }
}

async function createUser(reg, res) {
  try {
    const { username, password, roleId } = reg.body;
    const user = await User.create({ username, password, roleId });
    logger.info("se crea usuario " + username);
    res.json(user);
  } catch (error) {
    logger.error("error createUser " + error.message);
    res.status(500).json({ message: "server error" });
  }
}

async function getUser(reg, res) {
  try {
    const user = await User.findByPk(reg.params.id, {
      attributes: ["username", "status"],
    });
    if (!user) {
      return res.status(404).json({ message: "User no encontrado" });
    }
    res.json(user);
  } catch (error) {
    logger.error("error al obtenre usuario " + error);
    res.status(500).json({ message: "server error" });
  }
}

async function updateuser(req, res) {
  const { id } = req.params;
  const { username, password, roleId, status } = req.body;
  try {
    if (!username || !password)
      return res.status(400).json({ message: "Usuario o password requerido" });
    const user = await User.update(
      {
        username,
        password,
        roleId,
        status,
      },
      {
        where: {
          id,
        },
      }
    );
    res.json(user);
  } catch (error) {
    logger.error("error al actualizar usuario " + error.message);
    res.status(500).json({ message: "server error" });
  }
}

async function activateInactivate(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (!status) return res.status(400).json({ message: "Status requerido" });
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encotnrado" });
    }
    if (user.status === status) {
      return res.status(400).json({ message: "Es el mismo status" });
    }
    user.status = status;
    await user.save();
    res.json(user);
  } catch (error) {
    logger.error("error al actualizar usuario " + error.message);
    res.status(500).json({ message: "server error" });
  }
}

async function deleteUser(req, res) {
  logger.info("llega peticion de delete");
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User no encotnrado" });
    }
    await user.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    logger.error("error al eliminar usuario " + error.message);
    res.status(500).json({ message: "server error" });
  }
}

async function getTasks(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ["username"],
      include: [
        {
          model: Task,
          attributes: ["name", "done"],
          /* where: {
                    'done': true
                }, */
        },
      ],
      where: { id },
    });
    res.json(user);
  } catch (error) {
    logger.error("error al obtener tareas de usuario " + error.message);
    res.status(500).json({ message: "server error" });
  }
}

async function getTasksAll(req, res) {
  try {
    const user = await User.findAll({
      attributes: ["username"],
      include: [
        {
          model: Task,
          attributes: ["name", "done"],
          /* where: {
                    'done': true
                }, */
        },
      ],
    });
    res.json(user);
  } catch (error) {
    logger.error("error al obtener tareas de usuario " + error.message);
    res.status(500).json({ message: "server error" });
  }
}
export default {
  getUsers,
  createUser,
  getUser,
  updateuser,
  activateInactivate,
  deleteUser,
  getTasks,
  getTasksAll,
};
