import { User } from "../models/users.js";
import { Role } from "../models/role.js";
import { Permission } from "../models/permission.js";
import logger from "../logs/logger.js";
import { comparar } from "../common/bcrypt.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

async function login(req, res) {
  console.log("Body recibido:", req.body);
  try {
    const { username, password } = req.body;
    // Usamos el alias "Role" en el include, y luego incluimos el modelo Permission con alias "permissions"
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Role,
          as: "Role", // Debe coincidir con el alias definido en la asociación de User
          attributes: ["name"],
          include: [
            {
              model: Permission,
              as: "permissions", // Este alias debe coincidir con el que definimos en Role.belongsToMany
              attributes: ["name"] // O puedes incluir más atributos según lo necesites
            }
          ]
        }
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    if (!(await comparar(password, user.password))) {
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }
    const secret = process.env.JWT_SECRET;
    const segundos = process.env.JWT_EXPIRES_SECONDS;
    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: eval(segundos),
    });
    
    // Extraemos los permisos (por ejemplo, obtenemos un arreglo de nombres)
    const userPermissions = user.Role && user.Role.permissions
      ? user.Role.permissions.map(p => p.name)
      : [];
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.Role ? user.Role.name : "user",
        permissions: userPermissions,
      },
    });
  } catch (error) {
    logger.error("error en login " + error.message);
    res.status(500).json({ message: "server error" });
  }
}

export default {
  login,
};
