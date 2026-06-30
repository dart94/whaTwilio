import { BASE_URL } from '../config/apiConfig';

function getToken(): string | null {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    const parsed = JSON.parse(user);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  return response;
}
