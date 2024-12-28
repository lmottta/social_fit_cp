import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona um interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limiting
      console.error('Muitas requisições. Tente novamente em alguns segundos.');
    }

    if (!error.response) {
      // Erro de rede ou servidor indisponível
      console.error('Erro de conexão. Verifique sua internet.');
    }

    return Promise.reject(error);
  }
);
