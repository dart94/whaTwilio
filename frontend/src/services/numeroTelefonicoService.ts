import { BASE_URL } from "../config/apiConfig";

//** Interface para el modelo de número telefónico */
export interface NumeroTelefonico {
  id: number;
  numero: string;
  nombre: string;
  compania: string;
  creado: string;
  actualizado: string;
}

//*** Función para crear un número telefónico ***
export async function crearNumeroTelefonico(formData: {
  number: string;
  name: string;
  company: string;
}) {
  if (!formData.number || !formData.name || !formData.company) {
    throw new Error('Todos los campos son requeridos');
  }

  const response = await fetch(`${BASE_URL}/api/number_phones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}


//*** Función para obtener los números telefónicos  ***
export async function obtenerNumerosTelefonicos() {
  const response = await fetch(`${BASE_URL}/api/number_phones`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}


/** Actualizar un número telefónico */
export async function actualizarNumeroTelefonico(numeroTelefonico: NumeroTelefonico) {
  const response = await fetch(`${BASE_URL}/api/number_phones/${numeroTelefonico.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(numeroTelefonico),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  return response.json();
}

/**Obtener numeros por subcuenta */

export async function obtenerNumerosPorSubcuenta(sub_account_id: number) {
  const response = await fetch(
    `${BASE_URL}/api/number_phones/sub_account/${sub_account_id}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}