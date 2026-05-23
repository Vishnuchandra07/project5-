import axios from 'axios';
import { getToken } from '../utils/authStorage';
import { triggerUnauthorized, isAuthRoute } from '../utils/authSession';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !isAuthRoute(window.location.pathname)) {
      sessionStorage.setItem('sessionExpired', '1');
      triggerUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;
