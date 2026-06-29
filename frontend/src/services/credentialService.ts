import { apiFetch } from '../utils/apiFetch';

export interface Credencial {
  id: number;
  name: string;
  json: string;
  created_at: string;
  updated_at: string;
}

export async function crearCredencial(name: string, json: string) {
  if (!name || !json) throw new Error('Nombre y JSON son requeridos');
  try { JSON.parse(json); } catch { throw new Error('El formato JSON no es válido'); }

  const response = await apiFetch('/api/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, json }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }
  return response.json();
}

export async function obtenerCredenciales() {
  const response = await apiFetch('/api/credentials');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function getUserCredentials(email: string) {
  if (!email) throw new Error('Debe ingresar un correo electrónico');
  const response = await apiFetch('/api/credentials');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function actualizarCredencial(credencial: Credencial) {
  const response = await apiFetch(`/api/credentials/${credencial.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credencial),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al actualizar credencial (HTTP ${response.status})`);
  }
  return response.json();
}

export async function getCredencialById(id: number) {
  const response = await apiFetch(`/api/credentials/${id}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
