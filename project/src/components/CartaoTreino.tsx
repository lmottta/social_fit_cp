import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Clock, Activity, Dumbbell, Repeat, Weight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { alternarCurtida, verificarCurtida, obterTotalCurtidas, obterComentarios } from '../services/interacoes';
import SecaoComentarios from './SecaoComentarios';
import BotaoSeguir from './BotaoSeguir';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Cabeçalho do treino com informações do autor */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to={`/perfil/${treino.usuarioId}`} 
            className="flex items-center gap-3 hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors group"
          >
            <img
              src={treino.avatarUsuario || `https://ui-avatars.com/api/?name=${encodeURIComponent(treino.nomeUsuario)}&background=random`}
              alt={treino.nomeUsuario}
              className="w-12 h-12 rounded-full border-2 border-emerald-100 group-hover:border-emerald-200 transition-colors"
            />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{treino.nomeUsuario}</h3>
              <div className="text-sm text-gray-500 space-x-2">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {treino.duracao} min
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span className="capitalize">{treino.intensidade}</span>
                </span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {format(new Date(treino.criadoEm), "d 'de' MMM", { locale: ptBR })}
            </span>
            <BotaoSeguir
              usuarioId={treino.usuarioId}
              tamanho="sm"
              variante="outline"
            />
          </div>
        </div>

        {/* Tag do tipo de treino */}
        <div className="mb-4">
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2
            ${treino.tipo === 'força' 
              ? 'bg-purple-100 text-purple-600' 
              : treino.tipo === 'cardio'
              ? 'bg-orange-100 text-orange-600'
              : 'bg-blue-100 text-blue-600'
            }
          `}>
            <Dumbbell className="w-4 h-4" />
            {treino.tipo}
          </span>
        </div>

        {/* Lista de exercícios */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-600" />
            Exercícios
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {treino.exercicios.map((exercicio, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-emerald-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{exercicio.nome}</h5>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Repeat className="w-4 h-4 text-emerald-600" />
                        {exercicio.series} séries x {exercicio.repeticoes} reps
                      </div>
                      {exercicio.peso > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Weight className="w-4 h-4 text-emerald-600" />
                          {exercicio.peso}kg
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-medium">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barra de interações */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            {/* Botão de curtir */}
            <button
              onClick={handleCurtir}
              disabled={carregandoCurtida || !usuario}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50 group"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  curtido 
                    ? 'fill-emerald-600 text-emerald-600 scale-110' 
                    : 'group-hover:scale-110'
                }`}
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
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors group"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção de comentários */}
      <div className="bg-gray-50 border-t border-emerald-100">
        <div className="px-10 py-4">
          <SecaoComentarios
            atividadeId={treino.id}
            onAtualizarTotal={setTotalComentarios}
          />
        </div>
      </div>
    </div>
  );
}