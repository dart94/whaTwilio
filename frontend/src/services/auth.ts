import { apiFetch } from '../utils/apiFetch';

export async function login(email: string, password: string): Promise<any> {
  const response = await apiFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');
  return data;
}
