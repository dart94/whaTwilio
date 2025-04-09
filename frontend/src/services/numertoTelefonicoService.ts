import { BASE_URL } from "../config/apiConfig";

//*** Función para crear un número telefónico ***
export async function crearNumeroTelefonico(formData: {
  number: string;
  name: string;
  company: string;
}) {
  console.log('Datos enviados al servidor:', formData);
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
      console.log('Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error desconocido');
    } else {
      const errorText = await response.text();
      console.log('Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}


//*** Función para obtener los números telefónicos asociados a una subcuenta ***
export async function obtenerNumerosTelefonicos() {
  const response = await fetch(`${BASE_URL}/api/number_phones`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      console.log('Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error desconocido');
    } else {
      const errorText = await response.text();
      console.log('Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}
