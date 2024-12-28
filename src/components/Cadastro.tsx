import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '../auth';
import { useAuth } from '../contexts/AuthContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'aluno' | 'educador'>('aluno');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!nome || !email || !senha) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const response = await cadastrar(nome, email, senha, tipoUsuario);
      
      if (response.token) {
        login(response.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar conta</h2>
      <p>Comece sua jornada fitness hoje</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div>
        <label htmlFor="tipoUsuario">Tipo de Usuário</label>
        <select
          id="tipoUsuario"
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value as 'aluno' | 'educador')}
        >
          <option value="aluno">Aluno</option>
          <option value="educador">Educador</option>
        </select>
      </div>

      <div>
        <label htmlFor="nome">Nome completo</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Criar conta'}
      </button>
    </form>
  );
} 