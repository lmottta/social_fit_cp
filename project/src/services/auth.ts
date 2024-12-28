import bcryptjs from 'bcryptjs';
import { Usuario } from '../types/usuario';
import { mapDatabaseUserToModel } from '../utils/mappers';
import api from './api';

// Lista de modalidades disponíveis
export const MODALIDADES = [
  'Musculação',
  'CrossFit',
  'Corrida',
  'Natação',
  'Ciclismo',
  'Yoga',
  'Pilates',
  'Funcional',
  'Lutas',
  'Dança',
  'Outro'
];

// Lista de estados brasileiros
export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface LoginCredentials {
  email: string;
  senha: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: 'aluno' | 'educador';
}

export async function login({ email, senha }: LoginCredentials): Promise<{ user: Usuario; token: string }> {
  try {
    const response = await api.post('/auth/login', { email, senha });
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    return { 
      user: mapDatabaseUserToModel(user),
      token 
    };
  } catch (error) {
    throw new Error('Credenciais inválidas');
  }
}

export async function cadastrar(data: RegisterData): Promise<{ user: Usuario; token: string }> {
  try {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data;
    return { user: mapDatabaseUserToModel(user), token };
  } catch (error) {
    if ((error as any)?.response?.status === 409) {
      throw new Error('Email já cadastrado');
    }
    throw new Error('Erro ao cadastrar usuário');
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function atualizarAnamnese(
  userId: string,
  dadosAnamnese: {
    idade: string;
    altura: string;
    peso: string;
    objetivos: string;
    restricoes: string;
    experiencia: string;
    frequencia: string;
  }
): Promise<Usuario> {
  try {
    const response = await api.put(`/users/${userId}/anamnese`, dadosAnamnese);
    return mapDatabaseUserToModel(response.data);
  } catch (error) {
    console.error('Erro ao atualizar anamnese:', error);
    throw error;
  }
}

export async function atualizarPerfil(
  userId: string,
  dadosPerfil: {
    nome?: string;
    bio?: string;
    avatar?: string;
    instagram?: string;
    whatsapp?: string;
    cidade?: string;
    estado?: string;
    modalidades?: string[];
  }
): Promise<Usuario> {
  try {
    const response = await api.put(`/users/${userId}/perfil`, dadosPerfil);
    return mapDatabaseUserToModel(response.data);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

export async function buscarUsuario(id: string): Promise<Usuario> {
  try {
    const response = await api.get(`/users/${id}`);
    return mapDatabaseUserToModel(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}