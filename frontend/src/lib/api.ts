const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = {
  async post(endpoint: string, data: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).catch(err => {
      console.error(`Fetch error at ${endpoint}:`, err);
      throw new Error(`Network failure: ${err.message}`);
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error at ${endpoint}:`, { status: response.status, errorData });
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  },

  async get(endpoint: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    }).catch(err => {
      console.error(`Fetch error at ${endpoint}:`, err);
      throw new Error(`Network failure: ${err.message}`);
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error at ${endpoint}:`, { status: response.status, errorData });
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  },

  async patch(endpoint: string, data: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    }).catch(err => {
      console.error(`Fetch error at ${endpoint}:`, err);
      throw new Error(`Network failure: ${err.message}`);
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error at ${endpoint}:`, { status: response.status, errorData });
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    }).catch(err => {
      console.error(`Fetch error at ${endpoint}:`, err);
      throw new Error(`Network failure: ${err.message}`);
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error at ${endpoint}:`, { status: response.status, errorData });
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }
};
