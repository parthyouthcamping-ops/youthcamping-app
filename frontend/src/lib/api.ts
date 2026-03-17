const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });

  return response;
}
