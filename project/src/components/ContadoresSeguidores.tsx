import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { obterContadores } from '../services/relacionamentos';

interface ContadoresSeguidoresProps {
  usuarioId: string;
  onAtualizar?: () => void;
}

export default function ContadoresSeguidores({ usuarioId, onAtualizar }: ContadoresSeguidoresProps) {
  const [contadores, setContadores] = useState({ seguidores: 0, seguindo: 0 });

  useEffect(() => {
    const carregarContadores = async () => {
      try {
        const dados = await obterContadores(usuarioId);
        setContadores(dados);
      } catch (error) {
        console.error('Erro ao carregar contadores:', error);
      }
    };

    carregarContadores();
  }, [usuarioId, onAtualizar]);

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-500" />
        <div className="text-sm">
          <span className="font-bold">{contadores.seguidores}</span>
          <span className="text-gray-500 ml-1">seguidores</span>
        </div>
      </div>
      <div className="text-sm">
        <span className="font-bold">{contadores.seguindo}</span>
        <span className="text-gray-500 ml-1">seguindo</span>
      </div>
    </div>
  );
} 