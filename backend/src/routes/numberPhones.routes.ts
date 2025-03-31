import { Router } from 'express';
import { getNumberPhones,
        getNumberPhonesFormatted,
        createNumberPhone,
        associateNumberPhonesToSubAccount,
        getNumberPhonesBySubAccount,
        updateNumberPhone } 
        from '../controllers/numberPhones.controller';

const router = Router();

//ruta para obtener todos los números de teléfono
router.get('/number_phones', getNumberPhones);

//ruta para crear un número de teléfono
router.post('/number_phones', createNumberPhone);

//ruta para obtener todos los números de teléfono formateados
router.get('/number_phones/formatted', getNumberPhonesFormatted);

//ruta para asociar números de teléfono a una subcuenta
router.post('/number_phones/associate', associateNumberPhonesToSubAccount);

// Ruta para obtener todos los números de teléfono para una subcuenta específica
router.get('/number_phones/sub_account/:sub_account_id', getNumberPhonesBySubAccount);

// Ruta para actualizar un número de teléfono
router.put('/number_phones/:id', updateNumberPhone);


export default router;