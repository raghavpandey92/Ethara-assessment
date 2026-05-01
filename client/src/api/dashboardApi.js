import api from './axiosConfig';
import { API_ENDPOINTS } from '../config/apiConfig';

export function getDashboard() {
  return api.get(API_ENDPOINTS.dashboard);
}
