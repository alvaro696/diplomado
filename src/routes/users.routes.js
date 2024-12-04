import { Router } from 'express'
import usersController from "../controllers/users.controller.js";
import { authenticationToken } from '../middlewares/authenticate.middleware.js';


const router = Router();

router.route('/').get(usersController.getUsers).post(usersController.createUser);

router.route('/:id')
    .get(authenticationToken, usersController.getUser)
    .put(authenticationToken, usersController.updateuser)
    .patch(authenticationToken, usersController.activateInactivate)
    .delete(authenticationToken, usersController.deleteUser);

export default router;