// API Client for AICTE Grievance & Overlap Monitoring Backend

const API_PORT = 5001;
const BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location 
    ? `${window.location.protocol}//${window.location.hostname}:${API_PORT}/api` 
    : 'http://localhost:5001/api');

export function getAuthToken() {
  return localStorage.getItem('aicte_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('aicte_token', token);
  } else {
    localStorage.removeItem('aicte_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized
  if (response.status === 401 && endpoint !== '/auth/login') {
    setAuthToken(null);
    window.location.href = '/login';
    throw new Error('Session expired. Please sign in again.');
  }

  // Handle CSV stream
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    return response.blob();
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `API Request Failed: ${response.statusText}`);
  }

  return data;
}

export const api = {
  get: (endpoint, params = {}) => {
    const query = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    }
    const qs = query.toString();
    return request(`${endpoint}${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  post: (endpoint, body = {}) => {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  patch: (endpoint, body = {}) => {
    return request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete: (endpoint) => {
    return request(endpoint, { method: 'DELETE' });
  },

  downloadCSV: async (endpoint, params = {}, filename = 'AICTE_Report.csv') => {
    const query = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    }
    const qs = query.toString();
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}${endpoint}${qs ? `?${qs}` : ''}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) {
      throw new Error('Failed to generate export file.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
