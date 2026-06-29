import { apiFetch } from '../utils/apiFetch';

export async function associateCredentials(
  subAccountId: number,
  credentialAssociations: { credential_id: number }[]
) {
  const validAssociations = credentialAssociations.filter(assoc => assoc.credential_id !== 0);
  if (validAssociations.length === 0) throw new Error('Debe seleccionar al menos una credencial');

  for (const assoc of validAssociations) {
    const response = await apiFetch('/api/credentials/associate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sub_account_id: subAccountId, credentials_id: assoc.credential_id }),
    });
    if (!response.ok) throw new Error(`Error al asociar la credencial: ${response.statusText}`);
  }
  return true;
}

export async function associateNumbersToSubAccount(
  sub_account_id: number,
  number_phone_id: { number_phone: number }[]
) {
  const validAssociations = number_phone_id.filter(assoc => assoc.number_phone !== 0);
  if (validAssociations.length === 0) throw new Error('Debe seleccionar al menos un número telefónico');

  for (const assoc of validAssociations) {
    const response = await apiFetch('/api/number_phones/associate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sub_account_id, number_phone_id: assoc.number_phone }),
    });
    if (!response.ok) throw new Error(`Error al asociar el número telefónico: ${response.statusText}`);
  }
  return true;
}
