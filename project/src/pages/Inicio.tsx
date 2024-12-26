import React, { useState } from 'react';
import CartaoTreino from '../components/CartaoTreino';
import CartaoRanking from '../components/CartaoRanking';
import CriarPost from '../components/CriarPost';
import Post from '../components/Post';
import { Activity, Flame, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const treinosExemplo = [
  {
    id: '1',
    usuarioId: '1',
    nomeUsuario: 'João Silva',
    avatarUsuario: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    tipo: 'força',
    duracao: 60,
    intensidade: 'alta',
    exercicios: [
      { nome: 'Supino', series: 4, repeticoes: 10, peso: 80 },
      { nome: 'Agachamento', series: 4, repeticoes: 12, peso: 100 },
      { nome: 'Levantamento Terra', series: 3, repeticoes: 8, peso: 120 }
    ],
    criadoEm: new Date(),
    curtidas: 24,
    comentarios: []
  },
  {
    id: '2',
    usuarioId: '2',
    nomeUsuario: 'Maria Santos',
    avatarUsuario: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    tipo: 'cardio',
    duracao: 45,
    intensidade: 'média',
    exercicios: [
      { nome: 'Corrida', series: 1, repeticoes: 1, peso: 0 },
      { nome: 'Burpees', series: 3, repeticoes: 15, peso: 0 },
      { nome: 'Mountain Climbers', series: 3, repeticoes: 20, peso: 0 }
    ],
    criadoEm: new Date(),
    curtidas: 18,
    comentarios: []
  }
];

const postsExemplo = [
  {
    id: '1',
    autorId: '1',
    autorNome: 'João Silva',
    autorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    texto: 'Começando mais uma semana de treinos! 💪\nFoco total nos objetivos!',
    imagens: [],
    isPrivado: false,
    criadoEm: new Date(),
    curtidas: 15,
    comentarios: []
  },
  {
    id: '2',
    autorId: '2',
    autorNome: 'Maria Santos',
    autorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    texto: 'Qual é o melhor horário para treinar?',
    imagens: [],
    isPrivado: false,
    enquete: {
      opcoes: [
        { texto: 'Manhã cedo', votos: 45 },
        { texto: 'Horário do almoço', votos: 12 },
        { texto: 'Fim da tarde', votos: 38 },
        { texto: 'Noite', votos: 25 }
      ],
      totalVotos: 120
    },
    criadoEm: new Date(),
    curtidas: 32,
    comentarios: []
  }
];

function CartaoEstatistica({ icone, rotulo, valor }: { icone: React.ReactNode; rotulo: string; valor: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-2">
        {icone}
        <span className="ml-2 text-gray-600 text-sm">{rotulo}</span>
      </div>
      <div className="text-2xl font-bold">{valor}</div>
    </div>
  );
}

export default function Inicio() {
  const { usuario } = useAuth();
  const [posts, setPosts] = useState(postsExemplo);

  const handleNovoPost = (post: any) => {
    setPosts(prev => [{
      id: String(prev.length + 1),
      autorId: usuario?.id || '',
      autorNome: usuario?.nome || '',
      autorAvatar: usuario?.perfil?.avatar,
      ...post
    }, ...prev]);
  };

  return (
    <>
      {/* Visão geral das estatísticas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <CartaoEstatistica
          icone={<Activity className="w-6 h-6 text-green-500" />}
          rotulo="Treinos Semanais"
          valor="12"
        />
        <CartaoEstatistica
          icone={<Flame className="w-6 h-6 text-orange-500" />}
          rotulo="Sequência Atual"
          valor="7 dias"
        />
        <CartaoEstatistica
          icone={<Users className="w-6 h-6 text-blue-500" />}
          rotulo="Ranking Global"
          valor="#42"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Feed de Atividades</h2>
          
          {/* Criar post */}
          <div className="mb-8">
            <CriarPost onSubmit={handleNovoPost} />
          </div>

          {/* Lista de posts e treinos */}
          <div className="space-y-8">
            {[...posts, ...treinosExemplo].sort((a, b) => 
              new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
            ).map(item => (
              'tipo' in item ? (
                <CartaoTreino key={item.id} treino={item} />
              ) : (
                <Post key={item.id} {...item} />
              )
            ))}
          </div>
        </div>

        {/* Ranking */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Atletas</h2>
          <div className="space-y-2">
            <CartaoRanking
              usuarioId="3"
              posicao={1}
              nome="Sara Costa"
              pontos={2500}
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            />
            <CartaoRanking
              usuarioId="1"
              posicao={2}
              nome="João Silva"
              pontos={2350}
              avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
            />
            <CartaoRanking
              usuarioId="4"
              posicao={3}
              nome="Emma Wilson"
              pontos={2200}
              avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
            />
          </div>
        </div>
      </div>
    </>
  );
}