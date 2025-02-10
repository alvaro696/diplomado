import { Router } from "express";
import rolesCOntroller from "../controllers/roles.controller.js";

const router = Router();

router.route('/').
    get(rolesCOntroller.getRoles).
    post(rolesCOntroller.createRole);

router.route('/:id')
    .put(rolesCOntroller.updateRole)
    .delete(rolesCOntroller.deleteRole);

export default router;