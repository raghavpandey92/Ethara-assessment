import api from './axiosConfig';
import { API_ENDPOINTS } from '../config/apiConfig';

export function getTasks(projectId) {
  return api.get(API_ENDPOINTS.tasks, {
    params: projectId ? { projectId } : {},
  });
}

export function createTask(taskData) {
  return api.post(API_ENDPOINTS.tasks, taskData);
}

export function updateTaskStatus(taskId, status) {
  return api.put(`${API_ENDPOINTS.tasks}/${taskId}/status`, { status });
}
