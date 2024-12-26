import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Lock, Globe2, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SecaoComentarios from './SecaoComentarios';

interface OpcaoEnquete {
  texto: string;
  votos: number;
}

interface PostProps {
  id: string;
  autorId: string;
  autorNome: string;
  autorAvatar?: string;
  texto: string;
  imagens: string[];
  isPrivado: boolean;
  enquete?: {
    opcoes: OpcaoEnquete[];
    totalVotos: number;
  };
  criadoEm: Date;
  curtidas: number;
  comentarios: any[];
}

export default function Post({ 
  id,
  autorId,
  autorNome,
  autorAvatar,
  texto,
  imagens,
  isPrivado,
  enquete,
  criadoEm,
  curtidas: curtidasIniciais,
  comentarios
}: PostProps) {
  const { usuario } = useAuth();
  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(curtidasIniciais);
  const [totalComentarios, setTotalComentarios] = useState(comentarios.length);
  const [votoEnquete, setVotoEnquete] = useState<number | null>(null);

  const handleCurtir = () => {
    if (!usuario) return;
    
    setCurtido(prev => !prev);
    setCurtidas(prev => curtido ? prev - 1 : prev + 1);
    // TODO: Implementar chamada à API
  };

  const handleVotar = (index: number) => {
    if (!usuario || votoEnquete !== null || !enquete) return;
    
    setVotoEnquete(index);
    // TODO: Implementar chamada à API
  };

  const handleCompartilhar = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: `Post de ${autorNome}`,
        text: texto,
        url: window.location.href
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
      {/* Cabeçalho */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={`/perfil/${autorId}`}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors group"
          >
            <img
              src={autorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(autorNome)}&background=random`}
              alt={autorNome}
              className="w-10 h-10 rounded-full border-2 border-emerald-100 group-hover:border-emerald-200 transition-colors"
            />
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                {autorNome}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{format(new Date(criadoEm), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}</span>
                <span>•</span>
                {isPrivado ? (
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Privado
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Globe2 className="w-3 h-3" />
                    Público
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Conteúdo */}
        <div className="space-y-4">
          {texto && (
            <p className="text-gray-600 whitespace-pre-wrap">{texto}</p>
          )}

          {/* Imagens */}
          {imagens.length > 0 && (
            <div className={`grid ${imagens.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
              {imagens.map((imagem, index) => (
                <img
                  key={index}
                  src={imagem}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Enquete */}
          {enquete && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-medium text-gray-900">Enquete</h4>
              </div>
              <div className="space-y-2">
                {enquete.opcoes.map((opcao, index) => {
                  const porcentagem = enquete.totalVotos > 0 
                    ? Math.round((opcao.votos / enquete.totalVotos) * 100) 
                    : 0;

                  return (
                    <button
                      key={index}
                      onClick={() => handleVotar(index)}
                      disabled={votoEnquete !== null}
                      className={`w-full relative ${
                        votoEnquete === index 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'hover:bg-gray-50 border-gray-200'
                      } border rounded-lg p-3 transition-colors`}
                    >
                      <div className="relative z-10 flex justify-between items-center">
                        <span className="text-gray-900">{opcao.texto}</span>
                        <span className="text-sm font-medium text-emerald-600">
                          {porcentagem}%
                        </span>
                      </div>
                      <div 
                        className="absolute top-0 left-0 h-full bg-emerald-50 rounded-lg transition-all"
                        style={{ width: `${porcentagem}%` }}
                      />
                    </button>
                  );
                })}
                <p className="text-sm text-gray-500 text-center">
                  {enquete.totalVotos} votos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barra de interações */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            {/* Botão de curtir */}
            <button
              onClick={handleCurtir}
              disabled={!usuario}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50 group"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  curtido 
                    ? 'fill-emerald-600 text-emerald-600 scale-110' 
                    : 'group-hover:scale-110'
                }`}
              />
              <span className="text-sm font-medium">{curtidas}</span>
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
            atividadeId={id}
            onAtualizarTotal={setTotalComentarios}
          />
        </div>
      </div>
    </div>
  );
} 