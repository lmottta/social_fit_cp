import React, { useState, useEffect } from 'react';
import CartaoTreino from '../components/CartaoTreino';
import { Activity, Users, Filter, Dumbbell, Flame, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { verificarSeguindo } from '../services/relacionamentos';

type FiltroFeed = 'todos' | 'sigo' | 'recomendados';

interface Post {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  avatarUsuario?: string;
  tipo: string;
  duracao: number;
  intensidade: string;
  exercicios: Array<{
    nome: string;
    series: number;
    repeticoes: number;
    peso: number;
  }>;
  criadoEm: Date;
  curtidas: number;
  comentarios: any[];
}

export default function Feed() {
  const { usuario } = useAuth();
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroFeed>('todos');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsExibidos, setPostsExibidos] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar posts
  useEffect(() => {
    const carregarPosts = async () => {
      try {
        // Aqui você substituiria por uma chamada real à API
        const dadosPosts = [
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

        setPosts(dadosPosts);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarPosts();
  }, []);

  // Filtrar posts baseado no filtro ativo
  useEffect(() => {
    const filtrarPosts = async () => {
      if (!usuario) return;

      setCarregando(true);
      try {
        let postsFiltrados = [...posts];

        if (filtroAtivo === 'sigo') {
          // Filtra apenas posts de usuários que o usuário atual segue
          const postsPromises = posts.map(async (post) => {
            const seguindo = await verificarSeguindo(usuario.id, post.usuarioId);
            return seguindo ? post : null;
          });

          const resultados = await Promise.all(postsPromises);
          postsFiltrados = resultados.filter((post): post is Post => post !== null);
        } 
        else if (filtroAtivo === 'recomendados') {
          // Lógica de recomendação baseada em:
          // 1. Posts com mais curtidas
          // 2. Posts do mesmo tipo que o usuário costuma interagir
          // 3. Posts recentes
          postsFiltrados = posts
            .sort((a, b) => {
              // Prioriza posts mais recentes e com mais curtidas
              const pontuacaoA = a.curtidas + (new Date(a.criadoEm).getTime() / 1000000000);
              const pontuacaoB = b.curtidas + (new Date(b.criadoEm).getTime() / 1000000000);
              return pontuacaoB - pontuacaoA;
            })
            .slice(0, 5); // Limita a 5 posts recomendados
        }

        setPostsExibidos(postsFiltrados);
      } catch (error) {
        console.error('Erro ao filtrar posts:', error);
      } finally {
        setCarregando(false);
      }
    };

    if (filtroAtivo === 'todos') {
      setPostsExibidos(posts);
    } else {
      filtrarPosts();
    }
  }, [filtroAtivo, posts, usuario]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header com gradiente e pattern */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Feed de Atividades</h1>
              <p className="text-emerald-100">Inspire-se com os treinos da comunidade</p>
            </div>
            {usuario && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-emerald-100">Bem-vindo,</p>
                  <p className="text-white font-medium">{usuario.nome}</p>
                </div>
                <img
                  src={usuario.perfil?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=random`}
                  alt={usuario.nome}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Dumbbell className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Treinos</p>
                <p className="text-xl font-bold text-gray-800">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Treinos Hoje</p>
                <p className="text-xl font-bold text-gray-800">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ranking</p>
                <p className="text-xl font-bold text-gray-800">#42</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 border border-emerald-100">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroAtivo('todos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 transition-all ${
                filtroAtivo === 'todos' 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md' 
                  : 'hover:bg-emerald-50 text-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Todos
            </button>
            <button
              onClick={() => setFiltroAtivo('sigo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 transition-all ${
                filtroAtivo === 'sigo' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                  : 'hover:bg-blue-50 text-gray-600'
              }`}
            >
              <Users className="w-4 h-4" />
              Seguindo
            </button>
            <button
              onClick={() => setFiltroAtivo('recomendados')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 transition-all ${
                filtroAtivo === 'recomendados' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md' 
                  : 'hover:bg-orange-50 text-gray-600'
              }`}
            >
              <Activity className="w-4 h-4" />
              Recomendados
            </button>
          </div>
        </div>

        {/* Lista de posts */}
        {carregando ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Dumbbell className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>
            </div>
          </div>
        ) : postsExibidos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {filtroAtivo === 'sigo' ? (
                <Users className="w-8 h-8 text-emerald-600" />
              ) : filtroAtivo === 'recomendados' ? (
                <Activity className="w-8 h-8 text-emerald-600" />
              ) : (
                <Filter className="w-8 h-8 text-emerald-600" />
              )}
            </div>
            <p className="text-gray-500 mb-4">
              {filtroAtivo === 'sigo' 
                ? 'Você ainda não segue ninguém. Comece a seguir pessoas para ver seus treinos aqui!'
                : filtroAtivo === 'recomendados'
                ? 'Ainda não temos recomendações para você. Continue interagindo com mais posts!'
                : 'Nenhum treino encontrado.'}
            </p>
            <button 
              onClick={() => setFiltroAtivo('todos')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Ver todos os treinos
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {postsExibidos.map(post => (
              <CartaoTreino key={post.id} treino={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}