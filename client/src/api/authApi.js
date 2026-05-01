import api from './axiosConfig';
import { API_ENDPOINTS } from '../config/apiConfig';

export function loginUser(userData) {
  return api.post(API_ENDPOINTS.login, userData);
}

export function signupUser(userData) {
  return api.post(API_ENDPOINTS.signup, userData);
}
