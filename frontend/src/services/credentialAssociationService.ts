// src/services/credentialAssociationService.ts
import { BASE_URL } from '../config/apiConfig';


//*** Función para asociar credenciales a una subcuenta ***
export async function associateCredentials(
  subAccountId: number,
  credentialAssociations: { credential_id: number }[]
) {
  // Validar que la subcuenta no sea 0
  const validAssociations = credentialAssociations.filter(assoc => assoc.credential_id !== 0);
  
  if (validAssociations.length === 0) {
    throw new Error('Debe seleccionar al menos una credencial');
  }

  // Procesar cada asociación
  for (const assoc of validAssociations) {
    const response = await fetch(`${BASE_URL}/api/credentials/associate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sub_account_id: subAccountId,
        credentials_id: assoc.credential_id
      })
    });

    if (!response.ok) {
      throw new Error(`Error al asociar la credencial: ${response.statusText}`);
    }
  }
  return true;
}


//*** Función para Asociar números telefónicos a una subcuenta ***
export async function associateNumbersToSubAccount(
  sub_account_id: number,
  number_phone_id: { number_phone: number }[]
) {
  // Validar que la subcuenta no sea 0
  const validAssociations = number_phone_id.filter(assoc => assoc.number_phone !== 0);
  
  if (validAssociations.length === 0) {
    throw new Error('Debe seleccionar al menos una número telefónico');
  }

  // Procesar cada asociación
  for (const assoc of validAssociations) {
    const response = await fetch(`${BASE_URL}/api/number_phones/associate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sub_account_id: sub_account_id,
        number_phone_id: assoc.number_phone
      })
    });

    if (!response.ok) {
      throw new Error(`Error al asociar el número telefónico: ${response.statusText}`);
    }
  }
  return true;
}