import { API_BASE_URL, API_ENDPOINTS } from './config/apiConfig';

test('uses backend API routes', () => {
  expect(API_BASE_URL).toBe('http://localhost:5000/api');
  expect(API_ENDPOINTS.dashboard).toBe('/dashboard');
  expect(API_ENDPOINTS.projects).toBe('/projects');
  expect(API_ENDPOINTS.tasks).toBe('/tasks');
});
