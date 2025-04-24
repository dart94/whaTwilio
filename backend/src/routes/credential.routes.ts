import { Router } from 'express';
import { getCredentials,
        postCredentials,
        associateCredentialsToSubAccount,
        deleteCredential,
        updateCredential,
        getUserCredentials,
        getCredentialById

        } from '../controllers/credential.controller';

const router = Router();

// Ruta para obtener las credenciales
router.get('/credentials', getCredentials);

// Ruta para crear credencial
router.post('/credentials', postCredentials);

// Ruta para asociar las credenciales a una subcuenta
router.post('/credentials/associate', associateCredentialsToSubAccount);

// Ruta para eliminar credencial
router.delete('/credentials/delete', deleteCredential);

// Ruta para actualizar una credencial
router.put('/credentials/:id', updateCredential);       

// Ruta para obtener las credenciales asociadas al usuario
router.get('/credentials/user/:email', getUserCredentials);

// Ruta para obtener una credencial por ID
router.get('/credentials/:credential_id', getCredentialById);



export default router;