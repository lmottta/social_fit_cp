import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { login as loginService } from '../services/auth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await loginService(email, senha);
      login(resposta.token, resposta.usuario);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Ocorreu um erro ao fazer login');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center">
          <div className="flex justify-center">
            <LogIn className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Bem-vindo ao FitTracker</h2>
          <p className="mt-2 text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {erro && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="seu@email.com"
                required
                disabled={carregando}
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="••••••••"
                required
                disabled={carregando}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-blue-600 hover:text-blue-700">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}