export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  login: '/auth/login',
  signup: '/auth/signup',
  dashboard: '/dashboard',
  projects: '/projects',
  tasks: '/tasks',
  users: '/users',
};
