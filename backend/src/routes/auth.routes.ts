import { Router } from 'express';
import { login, getUserEmail, users, updateUser } from '../controllers/auth.controller';

const router = Router();

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para obtener el email del usuario
router.get('/user-email', getUserEmail);

// Ruta para obtener todos los usuarios
router.get('/users', users);

//Ruta para actualizar un usuario
router.put('/users/:id', updateUser);


export default router;