import { BASE_URL } from "../config/apiConfig";

export async function obtenerUsuario() {
  const response = await fetch(`${BASE_URL}/api/users`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}