import { API_BASE, SESSION_STORAGE_KEY } from '../config/constants';

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const getStoredToken = () => {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
};

export async function http(path, { method = 'GET', body } = {}) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data.error ?? 'Request failed', data.details);
  }
  return data;
}
