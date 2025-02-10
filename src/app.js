import express from "express";
import morgan from "morgan";
import { authenticationToken } from "./middlewares/authenticate.middleware.js";
import usersRouters from "./routes/users.routes.js";
import authRouteres from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia esto a la URL de tu frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// O permitir CORS para cualquier origen (solo para desarrollo)
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/login", authRouteres);
app.use("/api/users", usersRouters);
app.use("/api/tasks", authenticationToken, tasksRoutes);
app.use("/api/roles", rolesRoutes);

export default app;
