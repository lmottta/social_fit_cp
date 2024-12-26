import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Send, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adicionarComentario, obterComentarios, removerComentario } from '../services/interacoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SecaoComentariosProps {
  atividadeId: string;
  onAtualizarTotal: (total: number) => void;
}

export default function SecaoComentarios({ atividadeId, onAtualizarTotal }: SecaoComentariosProps) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Carregar comentários
  useEffect(() => {
    const carregarComentarios = async () => {
      setCarregando(true);
      try {
        const dados = await obterComentarios(atividadeId);
        setComentarios(dados);
        onAtualizarTotal(dados.length);
      } catch (error) {
        setErro('Erro ao carregar comentários');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };

    carregarComentarios();
  }, [atividadeId, onAtualizarTotal]);

  // Adicionar comentário
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!usuario || !novoComentario.trim()) return;

    setCarregando(true);
    setErro('');

    try {
      const comentario = await adicionarComentario(
        atividadeId,
        usuario.id,
        novoComentario.trim(),
        usuario.nome,
        usuario.perfil?.avatar
      );
      setComentarios(prev => {
        const novosComentarios = [...prev, comentario];
        onAtualizarTotal(novosComentarios.length);
        return novosComentarios;
      });
      setNovoComentario('');
    } catch (error) {
      setErro('Erro ao adicionar comentário');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Lidar com tecla Enter
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Remover comentário
  const handleRemover = async (comentarioId: string) => {
    if (!usuario) return;

    try {
      await removerComentario(atividadeId, comentarioId, usuario.id);
      setComentarios(prev => {
        const novosComentarios = prev.filter(c => c.id !== comentarioId);
        onAtualizarTotal(novosComentarios.length);
        return novosComentarios;
      });
    } catch (error) {
      setErro('Erro ao remover comentário');
      console.error(error);
    }
  };

  // Comentários a serem exibidos
  const comentariosVisiveis = mostrarTodos 
    ? comentarios 
    : comentarios.length <= 2 
      ? comentarios 
      : comentarios.slice(-2); // Pega os dois últimos comentários

  const temMaisComentarios = comentarios.length > 2;

  if (erro) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {erro}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de comentários */}
      <div className="space-y-2">
        {!mostrarTodos && temMaisComentarios && (
          <div className="text-center">
            <span 
              onClick={() => setMostrarTodos(true)}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              Ver mais comentários
            </span>
          </div>
        )}

        {comentariosVisiveis.map(comentario => (
          <div key={comentario.id} className="flex items-start gap-2">
            <img
              src={comentario.avatarUsuario || `https://ui-avatars.com/api/?name=${encodeURIComponent(comentario.nomeUsuario)}&background=random`}
              alt={comentario.nomeUsuario}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{comentario.nomeUsuario}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comentario.criadoEm), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{comentario.texto}</p>
              </div>
              {usuario?.id === comentario.usuarioId && (
                <button
                  onClick={() => handleRemover(comentario.id)}
                  className="text-xs text-red-500 hover:text-red-600 mt-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex justify-center p-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Formulário de novo comentário */}
      {usuario && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
          <img
            src={usuario.perfil?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=random`}
            alt={usuario.nome}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 relative">
            <textarea
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Adicione um comentário..."
              className="w-full px-3 py-2 pr-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={carregando}
            />
            <button
              type="submit"
              disabled={!novoComentario.trim() || carregando}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 