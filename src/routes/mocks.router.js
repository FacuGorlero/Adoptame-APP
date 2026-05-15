import {Router} from 'express';
const router = Router();

import petsController from '../controllers/pets.controller.js';
import usersController from '../controllers/users.controller.js';
import mocksController from '../controllers/mocks.controller.js';

router.get('/mockingPets', mocksController.getMascotas);
router.get('/mockingUsers', mocksController.getUsuarios);
router.post('/generateData', mocksController.generateData);
router.get("/users", usersController.getAllUsers);
router.get("/pets", petsController.getAllPets);
export default router