import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { getToken, removeToken } from '../utils/authToken';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function addAuthToken(config) {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

// This runs before every request and attaches the JWT if the user is logged in.
api.interceptors.request.use((config) => {
  return addAuthToken(config);
});

// This keeps common API errors easy to show in page components.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = 'Unable to connect to server. Please check if backend is running.';
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      removeToken();
      localStorage.removeItem('user');
      error.friendlyMessage = 'Session expired. Please login again.';
    }

    if (error.response.status === 404) {
      error.friendlyMessage = 'API route not found. Please check the request URL.';
    }

    return Promise.reject(error);
  }
);

export default api;
