import { BASE_URL } from "../config/apiConfig";

export interface Subcuenta {
  id: number;
  usuario: number;
  nombre: string;
  creado: string;
  actualizado: string;
}

export async function obtenerSubcuentas() {
  const response = await fetch(`${BASE_URL}/api/sub_accounts`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Mapea las propiedades del servidor a tu interfaz
  return data.map((item: any) => ({
    id: item.id,
    usuario: item.Usuario, 
    nombre: item.Nombre,
    creado: item.Creado,
    actualizado: item.Actualizado
  }));
}




// Obtener subcuentas por usuario
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

// Función para crear una subcuenta
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


  // Función para actualizar una subcuenta
export async function actualizarSubcuenta(subcuenta: Subcuenta): Promise<Subcuenta> {
  const response = await fetch(`${BASE_URL}/api/sub_accounts/${subcuenta.id}`, {
    method: 'PUT', // 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subcuenta),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error al actualizar subcuenta (HTTP ${response.status})`);
  }
  return response.json();
}