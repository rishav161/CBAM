import apiClient from './apiClient.js';

export async function createCustomerUser({ email, name, company }) {
  const { data } = await apiClient.post('/admin/users', { email, name, company });
  return data;
}

export async function getUsersList() {
  const { data } = await apiClient.get('/admin/users');
  return data.users;
}

export async function toggleUserStatus({ id, isActive }) {
  const { data } = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
  return data;
}
