import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get('/', usersController.getAllUsers);  // Ruta correcta para obtener todos los usuarios
router.get('/:uid', usersController.getUser);  // Ruta para obtener un usuario por ID
router.put('/:uid', usersController.updateUser);  // Ruta para actualizar un usuario
router.delete('/:uid', usersController.deleteUser);  // Ruta para eliminar un usuario

export default router;
