import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { verificarSeSegue, seguirUsuario, deixarDeSeguir } from '../services/relacionamentos';

interface BotaoSeguirProps {
  usuarioId: string;
  onAtualizarContadores?: () => void;
  tamanho?: 'sm' | 'md' | 'lg';
  variante?: 'padrao' | 'outline';
}

export default function BotaoSeguir({
  usuarioId,
  onAtualizarContadores,
  tamanho = 'md',
  variante = 'padrao'
}: BotaoSeguirProps) {
  const { usuario } = useAuth();
  const [seguindo, setSeguindo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Verifica se já segue o usuário
  useEffect(() => {
    if (usuario) {
      verificarSeSegue(usuario.id, usuarioId)
        .then(setSeguindo)
        .catch(console.error);
    }
  }, [usuario, usuarioId]);

  // Não mostra o botão se for o próprio usuário
  if (usuario?.id === usuarioId) {
    return null;
  }

  const handleClick = async () => {
    if (!usuario || carregando) return;

    setCarregando(true);
    setErro('');

    try {
      if (seguindo) {
        await deixarDeSeguir(usuario.id, usuarioId);
        setSeguindo(false);
      } else {
        await seguirUsuario(usuario.id, usuarioId);
        setSeguindo(true);
      }
      onAtualizarContadores?.();
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Erro ao atualizar relacionamento');
      }
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Classes base do botão
  const baseClasses = 'flex items-center gap-2 rounded-lg transition-colors font-medium';
  
  // Classes específicas para cada tamanho
  const tamanhoClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  // Classes específicas para cada variante e estado
  const varianteClasses = {
    padrao: seguindo
      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      : 'bg-blue-600 text-white hover:bg-blue-700',
    outline: seguindo
      ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={carregando}
        className={`
          ${baseClasses}
          ${tamanhoClasses[tamanho]}
          ${varianteClasses[variante]}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {carregando ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : seguindo ? (
          <UserMinus className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        <span>{seguindo ? 'Seguindo' : 'Seguir'}</span>
      </button>
      {erro && (
        <p className="text-red-500 text-sm mt-1">{erro}</p>
      )}
    </div>
  );
} 