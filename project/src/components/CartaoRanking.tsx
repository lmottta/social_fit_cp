import React from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartaoRankingProps {
  posicao: number;
  nome: string;
  pontos: number;
  avatar: string;
  usuarioId: string;
}

export default function CartaoRanking({ posicao, nome, pontos, avatar, usuarioId }: CartaoRankingProps) {
  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm mb-2">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4
        ${posicao === 1 ? 'bg-yellow-100 text-yellow-600' :
          posicao === 2 ? 'bg-gray-100 text-gray-600' :
          posicao === 3 ? 'bg-orange-100 text-orange-600' :
          'bg-blue-50 text-blue-600'}`}>
        {posicao <= 3 ? <Trophy className="w-4 h-4" /> : posicao}
      </div>
      
      <Link to={`/perfil/${usuarioId}`} className="flex items-center flex-1 hover:opacity-80">
        <img src={avatar} alt={nome} className="w-10 h-10 rounded-full" />
        
        <div className="ml-4">
          <h3 className="font-semibold hover:text-blue-600 transition-colors">{nome}</h3>
          <p className="text-sm text-gray-500">{pontos} pontos</p>
        </div>
      </Link>
    </div>
  );
}