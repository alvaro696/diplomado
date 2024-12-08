import express from 'express';
import morgan from 'morgan';
import { authenticationToken } from './middlewares/authenticate.middleware.js';
import usersRouters from './routes/users.routes.js';
import authRouteres from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/login', authRouteres);
app.use('/api/users', usersRouters);
app.use('/api/tasks', authenticationToken, tasksRoutes);

export default app;