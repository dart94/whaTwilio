import { BASE_URL } from "../config/apiConfig";

export interface Credencial {
  id: number;
  name: string;
  json: string;
  created_at: string;
  updated_at: string;
}

// función para crear una nueva credencial
export async function crearCredencial(name: string, json: string) {
    if (!name || !json) {
      throw new Error('Nombre y JSON son requeridos');
    }
    
    // Validar que el JSON sea válido
    try {
      JSON.parse(json);
    } catch (e) {
      throw new Error('El formato JSON no es válido');
    }
  
    const response = await fetch(`${BASE_URL}/api/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, json })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    }
    return response.json();
  }
  
// función para buscar credenciales por ID
export async function obtenerCredenciales() {
  const response = await fetch(`${BASE_URL}/api/credentials`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

//Función para obtener credenciales por usuario
export async function getUserCredentials(email: string) {
  if (!email) {
    throw new Error('Debe ingresar un correo electrónico');
  }
  const response = await fetch(`${BASE_URL}/api/credentials`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}


// función para actualizar una credencial
export async function actualizarCredencial(credencial: Credencial) {
  const response = await fetch(`${BASE_URL}/api/credentials/${credencial.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credencial)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al actualizar credencial (HTTP ${response.status})`);
  }
  return response.json();
}

//OBtener credencial por ID
export async function getCredencialById(id: number) {
  const response = await fetch(`${BASE_URL}/api/credentials/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}