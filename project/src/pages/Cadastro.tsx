import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrar } from '../services/auth';

export default function Cadastro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'aluno' | 'educador'>('aluno');
  const [erro, setErro] = useState<{[key: string]: string}>({});
  const [carregando, setCarregando] = useState(false);

  const validarFormulario = (): boolean => {
    const novosErros: {[key: string]: string} = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = 'Email inválido';
    }

    if (!senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (senha.length < 8) {
      novosErros.senha = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(senha)) {
      novosErros.senha = 'Senha deve conter letras maiúsculas, minúsculas e números';
    }

    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErro(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro({});

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    try {
      const resposta = await cadastrar(nome, email, senha, tipoUsuario);
      
      // Verifica se a resposta é válida
      if (!resposta?.token || !resposta?.usuario) {
        throw new Error('Resposta inválida do servidor');
      }

      // Salva os dados do usuário e token
      login(resposta.token, resposta.usuario);
      
      // Redireciona com base no tipo de usuário
      if (tipoUsuario === 'aluno') {
        navigate('/anamnese');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      if (error instanceof Error) {
        // Verifica se é um erro específico de validação
        if (error.message.includes('Nome') || error.message.includes('Email') || error.message.includes('Senha')) {
          setErro({ geral: error.message });
        } else {
          setErro({ geral: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
        }
      } else {
        setErro({ geral: 'Ocorreu um erro ao criar sua conta. Tente novamente.' });
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
            <UserPlus className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Criar conta</h2>
          <p className="mt-2 text-gray-600">Comece sua jornada fitness hoje</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {erro.geral && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {erro.geral}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="tipoUsuario" className="block text-sm font-medium text-gray-700">
                Tipo de Usuário
              </label>
              <select
                id="tipoUsuario"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value as 'aluno' | 'educador')}
                className={`mt-1 block w-full rounded-lg border ${erro.tipoUsuario ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
                required
                disabled={carregando}
              >
                <option value="aluno">Aluno</option>
                <option value="educador">Educador Físico</option>
              </select>
              {erro.tipoUsuario && (
                <p className="mt-1 text-sm text-red-600">{erro.tipoUsuario}</p>
              )}
            </div>

            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`mt-1 block w-full rounded-lg border ${erro.nome ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
                placeholder="Seu nome"
                required
                disabled={carregando}
              />
              {erro.nome && (
                <p className="mt-1 text-sm text-red-600">{erro.nome}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-lg border ${erro.email ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
                placeholder="seu@email.com"
                required
                disabled={carregando}
              />
              {erro.email && (
                <p className="mt-1 text-sm text-red-600">{erro.email}</p>
              )}
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
                className={`mt-1 block w-full rounded-lg border ${erro.senha ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
                placeholder="••••••••"
                required
                disabled={carregando}
              />
              {erro.senha && (
                <p className="mt-1 text-sm text-red-600">{erro.senha}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={`mt-1 block w-full rounded-lg border ${erro.confirmarSenha ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
                placeholder="••••••••"
                required
                disabled={carregando}
              />
              {erro.confirmarSenha && (
                <p className="mt-1 text-sm text-red-600">{erro.confirmarSenha}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}