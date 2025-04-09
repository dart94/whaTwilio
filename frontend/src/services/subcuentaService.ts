import { BASE_URL } from "../config/apiConfig";

export async function buscarSubcuentasPorUsuario(email: string) {
  if (!email) {
    throw new Error('Debe ingresar un correo electrónico');
  }
  
  const response = await fetch(`${BASE_URL}/api/sub_accounts/user/${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

  
  export async function crearSubcuenta(email: string, nombreSubcuenta: string) {
    if (!email || !nombreSubcuenta) {
      throw new Error('Correo electrónico y nombre de subcuenta son requeridos');
    }
  
    const response = await fetch(`${BASE_URL}/api/sub_accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombreSubcuenta }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    }
    return response.json();
  }
  