import api from './axiosConfig';
import { API_ENDPOINTS } from '../config/apiConfig';

export function getUsers() {
  return api.get(API_ENDPOINTS.users);
}
