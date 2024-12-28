import { AuthResponse, Usuario } from './types/usuario';

interface AuthResponse {
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'aluno' | 'educador';
  };
  token: string;
}

export async function cadastrar(
  nome: string,
  email: string, 
  senha: string,
  tipoUsuario: 'aluno' | 'educador'
): Promise<AuthResponse> {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        nome,
        email, 
        senha,
        tipoUsuario
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao cadastrar usuário');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    throw error instanceof Error ? error : new Error('Erro ao cadastrar usuário');
  }
} 