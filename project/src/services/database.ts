import api from './api';
import { Usuario } from '../types/usuario';

export async function createUser(userData: Omit<Usuario, 'id'>) {
  const response = await api.post('/users', userData);
  return response.data;
}

export async function findUserByEmail(email: string) {
  const response = await api.get(`/users/email/${email}`);
  return response.data;
}

export async function findUserById(id: number) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: number, userData: Partial<Usuario>) {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`);
}

export async function listUsers() {
  const response = await api.get('/users');
  return response.data;
}
