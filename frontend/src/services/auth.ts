import { BASE_URL } from "../config/apiConfig";

export async function login(email: string, password: string): Promise<any> {

    // Llamar al servidor para iniciar sesión
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
  
    return data;
  }