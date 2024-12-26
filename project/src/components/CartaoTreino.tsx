import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { alternarCurtida, verificarCurtida, obterTotalCurtidas, obterComentarios } from '../services/interacoes';
import SecaoComentarios from './SecaoComentarios';
import BotaoSeguir from './BotaoSeguir';

interface Exercicio {
  nome: string;
  series: number;
  repeticoes: number;
  peso: number;
}

interface TreinoProps {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  avatarUsuario?: string;
  tipo: string;
  duracao: number;
  intensidade: string;
  exercicios: Exercicio[];
  criadoEm: Date;
  curtidas: number;
  comentarios: any[];
}

interface CartaoTreinoProps {
  treino: TreinoProps;
}

export default function CartaoTreino({ treino }: CartaoTreinoProps) {
  const { usuario } = useAuth();
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(treino.curtidas);
  const [totalComentarios, setTotalComentarios] = useState(0);
  const [carregandoCurtida, setCarregandoCurtida] = useState(false);

  // Carregar curtidas e comentários iniciais
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const carregarDados = async () => {
      if (usuario) {
        try {
          const [curtidoRes, totalCurtidasRes, comentariosRes] = await Promise.all([
            verificarCurtida(treino.id, usuario.id),
            obterTotalCurtidas(treino.id),
            obterComentarios(treino.id)
          ]);

          if (mounted) {
            setCurtido(curtidoRes);
            setTotalCurtidas(totalCurtidasRes);
            setTotalComentarios(comentariosRes.length);
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            return; // Ignora erros de cancelamento
          }
          console.error('Erro ao carregar dados:', error);
        }
      }
    };

    carregarDados();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [treino.id, usuario]);

  // Função para curtir/descurtir com debounce
  const handleCurtir = useCallback(async () => {
    if (!usuario || carregandoCurtida) return;

    setCarregandoCurtida(true);
    try {
      const { curtido: novoCurtido, totalCurtidas: novoTotal } = await alternarCurtida(treino.id, usuario.id);
      
      // Atualiza o estado local otimisticamente
      setCurtido(novoCurtido);
      setTotalCurtidas(novoTotal);
    } catch (error) {
      // Reverte o estado em caso de erro
      setCurtido(prev => !prev);
      setTotalCurtidas(prev => curtido ? prev - 1 : prev + 1);
      
      if (error instanceof Error) {
        console.error('Erro ao curtir:', error.message);
      }
    } finally {
      setCarregandoCurtida(false);
    }
  }, [usuario, treino.id, carregandoCurtida, curtido]);

  // Função para compartilhar com tratamento de erros melhorado
  const handleCompartilhar = async () => {
    if (!navigator.share) {
      console.warn('API de compartilhamento não suportada');
      return;
    }

    try {
      await navigator.share({
        title: `Treino de ${treino.tipo}`,
        text: `Confira este treino de ${treino.tipo} com duração de ${treino.duracao} minutos!`,
        url: window.location.href
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
      {/* Cabeçalho do treino com informações do autor */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={`/perfil/${treino.usuarioId}`} 
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <img
              src={treino.avatarUsuario || `https://ui-avatars.com/api/?name=${encodeURIComponent(treino.nomeUsuario)}&background=random`}
              alt={treino.nomeUsuario}
              className="w-10 h-10 rounded-full border border-emerald-100"
            />
            <div>
              <h3 className="font-medium text-gray-900 hover:text-emerald-600">{treino.nomeUsuario}</h3>
              <div className="text-sm text-gray-500 space-x-2">
                <span>{treino.duracao} minutos</span>
                <span>•</span>
                <span className="capitalize">{treino.intensidade}</span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {new Date(treino.criadoEm).toLocaleDateString('pt-BR')}
            </span>
            <BotaoSeguir
              usuarioId={treino.usuarioId}
              tamanho="sm"
              variante="outline"
            />
          </div>
        </div>

        {/* Tipo do treino */}
        <div className="flex items-center gap-2 mb-4 px-2">
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${treino.tipo === 'força' 
              ? 'bg-orange-100 text-orange-700' 
              : treino.tipo === 'cardio'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-blue-100 text-blue-700'
            } capitalize
          `}>
            {treino.tipo}
          </span>
        </div>

        {/* Lista de exercícios */}
        <div className="space-y-2 bg-gray-50 rounded-lg p-4 mb-4 mx-2">
          {treino.exercicios.map((exercicio, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-xs text-emerald-600 font-medium">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900">{exercicio.nome}</span>
              </div>
              <span className="text-gray-600">
                {exercicio.series}x{exercicio.repeticoes} • {exercicio.peso}kg
              </span>
            </div>
          ))}
        </div>

        {/* Barra de interações */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 px-2">
          <div className="flex items-center gap-6">
            {/* Botão de curtir */}
            <button
              onClick={handleCurtir}
              disabled={carregandoCurtida || !usuario}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
            >
              <Heart
                className={`w-5 h-5 ${curtido ? 'fill-emerald-600 text-emerald-600' : ''}`}
              />
              <span className="text-sm font-medium">{totalCurtidas}</span>
            </button>

            {/* Contador de comentários */}
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{totalComentarios}</span>
            </div>

            {/* Botão de compartilhar */}
            <button
              onClick={handleCompartilhar}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção de comentários - sempre visível */}
      <div className="bg-gray-50 border-t border-emerald-100 px-6 py-4">
        <SecaoComentarios
          atividadeId={treino.id}
          onAtualizarTotal={setTotalComentarios}
        />
      </div>
    </div>
  );
}