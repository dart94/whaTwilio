import { Router } from 'express';
import { createSubAccount, getSubAccounts, getSubAccountsByUserId, updateSubAccount } from '../controllers/subAccounts.controller';

const router = Router();

// Ruta para crear subcuenta
router.post('/sub_accounts', createSubAccount);
// Ruta para obtener subcuentas
router.get('/sub_accounts', getSubAccounts);
// Ruta para obtener subcuentas por ID de usuario
router.get('/sub_accounts/user/:email', getSubAccountsByUserId);
// Ruta para actualizar una subcuenta
router.put('/sub_accounts/:id', updateSubAccount);

export default router;