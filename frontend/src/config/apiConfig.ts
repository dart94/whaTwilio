// Configuración de la API
export const BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001';

// Para depuración
console.log("BASE_URL:", BASE_URL);