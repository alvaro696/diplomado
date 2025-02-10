import { User } from "../models/users.js";
import logger from "../logs/logger.js";

async function getRoles(req, res) {
    try {
      const role = await User.findAll(); // Asumiendo que tienes un modelo Role
      res.json({ data: role });
    } catch (error) {
      console.error("Error en getRoles:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }


export default {
    getRoles,
}