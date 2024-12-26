import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarUsuario } from '../services/auth';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'aluno' | 'educador';
  anamneseCompleta?: boolean;
  anamnese?: {
    idade: string;
    altura: string;
    peso: string;
    objetivos: string;
    restricoes: string;
    experiencia: string;
    frequencia: string;
  };
  perfil?: {
    avatar?: string;
    bio?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    cidade?: string;
    estado?: string;
    academia?: string;
    modalidades?: string[];
    outraModalidade?: string;
  };
  estatisticas?: {
    totalTreinos: string;
    minutosTotais: string;
  };
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario, shouldRedirect?: boolean) => void;
  logout: () => void;
  getUsuario: (id: string) => Promise<Usuario>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carrega os dados do usuário do localStorage ao iniciar
  useEffect(() => {
    const carregarUsuario = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const usuarioSalvo = localStorage.getItem('auth_usuario');

        if (token && usuarioSalvo) {
          const dadosUsuario = JSON.parse(usuarioSalvo);
          setUsuario(dadosUsuario);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Em caso de erro, limpa os dados
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_usuario');
        setUsuario(null);
        setIsAuthenticated(false);
      }
    };

    carregarUsuario();
  }, []);

  const login = useCallback((token: string, usuario: Usuario, shouldRedirect = true) => {
    try {
      // Salva os dados no localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_usuario', JSON.stringify(usuario));

      // Atualiza o estado
      setUsuario(usuario);
      setIsAuthenticated(true);

      // Redireciona se necessário
      if (shouldRedirect) {
        if (usuario.tipoUsuario === 'aluno' && !usuario.anamneseCompleta) {
          navigate('/anamnese');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    try {
      // Limpa os dados do localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_usuario');

      // Limpa o estado
      setUsuario(null);
      setIsAuthenticated(false);

      // Redireciona para a página de login
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [navigate]);

  const getUsuario = useCallback(async (id: string): Promise<Usuario> => {
    try {
      const usuario = await buscarUsuario(id);
      return {
        ...usuario,
        tipoUsuario: usuario.tipoUsuario as 'aluno' | 'educador'
      };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Erro ao buscar dados do usuário');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, login, logout, getUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 