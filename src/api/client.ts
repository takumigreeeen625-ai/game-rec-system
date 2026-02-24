const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getAuthToken = () => localStorage.getItem('token');

export const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
    localStorage.removeItem('token');
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
};
