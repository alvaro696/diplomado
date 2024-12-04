import express from 'express';
import morgan from 'morgan';
import usersRouters from './routes/users.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', usersRouters);

export default app;