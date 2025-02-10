import { User } from "../models/users.js";
import { Role } from "../models/role.js";
import logger from "../logs/logger.js";
import { comparar } from "../common/bcrypt.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

async function login(req, res) {
  console.log("Body recibido:", req.body);
  try {
    const { username, password } = req.body;
    // Usamos el alias "Role" en la consulta include
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Role,
          as: "Role", // Asegúrate de que coincide con la asociación en el modelo
          attributes: ["name", "permissions"],
        },
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
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        // Extraemos el rol del objeto Role obtenido en la consulta
        role: user.Role ? user.Role.name : "user",
        permissions: user.Role ? user.Role.permissions : [],
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
