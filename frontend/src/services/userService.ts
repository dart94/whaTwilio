import { BASE_URL } from "../config/apiConfig";

export async function obtenerUsuarios() {
  const response = await fetch(`${BASE_URL}/api/users`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

//Editar usuario
export async function actualizarUsuario(usuario: Usuario) {
  const response = await fetch(`${BASE_URL}/api/users/${usuario.id}`, {
    method: 'PUT', // o PATCH, según tu API
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al actualizar usuario (HTTP ${response.status})`);
  }
  
  return response.json();
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}