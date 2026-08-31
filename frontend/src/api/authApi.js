import apiClient from './apiClient.js';

export async function loginApi({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}

export async function getMeApi() {
  const { data } = await apiClient.get('/auth/me');
  return data.user;
}

export async function changePasswordApi({ currentPassword, newPassword }) {
  const { data } = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  return data;
}
