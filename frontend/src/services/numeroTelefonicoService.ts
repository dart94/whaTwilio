import { apiFetch } from '../utils/apiFetch';

export interface NumeroTelefonico {
  id: number;
  numero: string;
  nombre: string;
  compania: string;
  creado: string;
  actualizado: string;
}

export async function crearNumeroTelefonico(formData: { number: string; name: string; company: string }) {
  if (!formData.number || !formData.name || !formData.company) throw new Error('Todos los campos son requeridos');

  const response = await apiFetch('/api/number_phones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function obtenerNumerosTelefonicos() {
  const response = await apiFetch('/api/number_phones', {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function actualizarNumeroTelefonico(numeroTelefonico: NumeroTelefonico) {
  const response = await apiFetch(`/api/number_phones/${numeroTelefonico.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(numeroTelefonico),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function obtenerNumerosPorSubcuenta(sub_account_id: number) {
  const response = await apiFetch(`/api/number_phones/sub_account/${sub_account_id}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
