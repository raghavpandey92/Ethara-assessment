import api from './axiosConfig';
import { API_ENDPOINTS } from '../config/apiConfig';

export function getProjects() {
  return api.get(API_ENDPOINTS.projects);
}

export function createProject(projectData) {
  return api.post(API_ENDPOINTS.projects, projectData);
}

export function addProjectMember(projectId, memberId) {
  return api.put(`${API_ENDPOINTS.projects}/${projectId}/members`, { memberId });
}
