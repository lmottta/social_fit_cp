// Funções para gerenciar o token de autenticação de forma segura

export function getAuthToken(): string | null {
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        clearAuthState();
        return null;
      }
      return token;
    } catch {
      clearAuthState();
      return null;
    }
  }
  return null;
}

export function setAuthToken(token: string, remember: boolean = false): void {
  try {
    // Verifica se o token é válido
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    if (tokenData.exp * 1000 < Date.now()) {
      throw new Error('Token expirado');
    }

    // Armazena apenas em sessionStorage para maior segurança
    sessionStorage.setItem('auth_token', token);

    // Se remember for true, armazena um refresh token em localStorage
    if (remember) {
      const refreshToken = generateRefreshToken();
      localStorage.setItem('refresh_token', refreshToken);
    }
  } catch (error) {
    console.error('Erro ao processar token:', error);
    clearAuthState();
  }
}

export function clearAuthState(): void {
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_usuario');
}

function generateRefreshToken(): string {
  return btoa(crypto.getRandomValues(new Uint8Array(32)).toString());
}

// Função para renovar o token usando refresh token
export async function refreshAuthToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    // TODO: Implementar chamada à API para renovar o token
    // const response = await api.post('/auth/refresh', { refreshToken });
    // return response.data.token;
    return null;
  } catch {
    clearAuthState();
    return null;
  }
} 