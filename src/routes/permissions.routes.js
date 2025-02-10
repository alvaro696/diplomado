import { Router } from "express";
import permissionsController from "../controllers/permissions.controller.js";

const router = Router();

router.route('/').
    get(permissionsController.getPermissions).
    post(permissionsController.createPermission);

router.route('/:id')
    .put(permissionsController.updatePermission)
    .delete(permissionsController.deletePermission);

export default router;