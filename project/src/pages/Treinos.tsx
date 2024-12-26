import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Plus, Filter, Clock, ListChecks, Pencil, Trash2, Search,
  ChevronDown, Play, CheckCircle, Eye, ChevronUp
} from 'lucide-react';
import type { Treino, TipoTreino, StatusTreino } from '../types';
import Modal from '../components/Modal';
import FormularioTreino, { DadosTreino } from '../components/FormularioTreino';
import { useAuth } from '../contexts/AuthContext';

// Dados de exemplo para desenvolvimento
const treinosDisponiveis: Treino[] = [
  {
    id: '1',
    usuarioId: '1',
    nome: 'Treino Full Body A',
    tipo: 'forca',
    duracao: 60,
    nivel: 'iniciante',
    intensidade: 'alta',
    objetivo: 'Hipertrofia e força',
    descricao: 'Treino completo para trabalhar todos os grupos musculares com foco em hipertrofia.',
    exercicios: [
      { nome: 'Supino Reto', series: 4, repeticoes: 12, peso: 60, descanso: 60 },
      { nome: 'Agachamento', series: 4, repeticoes: 12, peso: 80, descanso: 90 },
      { nome: 'Puxada na Frente', series: 4, repeticoes: 12, peso: 65, descanso: 60 },
      { nome: 'Leg Press 45°', series: 4, repeticoes: 15, peso: 120, descanso: 90 },
      { nome: 'Desenvolvimento', series: 3, repeticoes: 12, peso: 40, descanso: 60 },
      { nome: 'Extensão de Tríceps', series: 3, repeticoes: 15, peso: 30, descanso: 45 }
    ],
    criadoEm: new Date(),
    status: 'nao_iniciado',
    curtidas: 0,
    comentarios: []
  },
  {
    id: '2',
    usuarioId: '1',
    nome: 'HIIT Cardio',
    tipo: 'hiit',
    duracao: 30,
    nivel: 'intermediario',
    intensidade: 'alta',
    objetivo: 'Queima de gordura e condicionamento',
    descricao: 'Treino intervalado de alta intensidade para maximizar o gasto calórico.',
    exercicios: [
      { nome: 'Burpees', series: 4, repeticoes: 15, descanso: 30 },
      { nome: 'Mountain Climbers', series: 4, repeticoes: 30, descanso: 30 },
      { nome: 'Jump Squats', series: 4, repeticoes: 20, descanso: 30 },
      { nome: 'Push-ups', series: 4, repeticoes: 15, descanso: 30 }
    ],
    criadoEm: new Date(),
    status: 'em_andamento',
    iniciadoEm: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    curtidas: 0,
    comentarios: []
  },
  {
    id: '3',
    usuarioId: '1',
    nome: 'Yoga para Flexibilidade',
    tipo: 'yoga',
    duracao: 45,
    nivel: 'iniciante',
    intensidade: 'baixa',
    objetivo: 'Melhorar flexibilidade e equilíbrio',
    descricao: 'Sequência de posturas para aumentar a flexibilidade e reduzir o estresse.',
    exercicios: [
      { nome: 'Saudação ao Sol', series: 1, repeticoes: 10, descanso: 0 },
      { nome: 'Postura do Cachorro Olhando para Baixo', series: 1, repeticoes: 1, descanso: 0 },
      { nome: 'Guerreiro I', series: 1, repeticoes: 1, descanso: 0 },
      { nome: 'Guerreiro II', series: 1, repeticoes: 1, descanso: 0 },
      { nome: 'Postura da Cobra', series: 1, repeticoes: 3, descanso: 0 }
    ],
    criadoEm: new Date(),
    status: 'concluido',
    iniciadoEm: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    concluidoEm: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    curtidas: 0,
    comentarios: []
  }
];

// Função para carregar treinos do localStorage
function carregarTreinosDoStorage(): Treino[] {
  try {
    const treinosSalvos = localStorage.getItem('treinos_db');
    if (!treinosSalvos) {
      return treinosDisponiveis;
    }
    return JSON.parse(treinosSalvos);
  } catch (error) {
    console.error('Erro ao carregar treinos:', error);
    return treinosDisponiveis;
  }
}

// Função para salvar treinos no localStorage
function salvarTreinosNoStorage(treinos: Treino[]) {
  try {
    localStorage.setItem('treinos_db', JSON.stringify(treinos));
  } catch (error) {
    console.error('Erro ao salvar treinos:', error);
  }
}

export default function Treinos() {
  const { usuario } = useAuth();
  const [filtroTipo, setFiltroTipo] = useState<TipoTreino | 'todos'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<StatusTreino | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [treinoExpandido, setTreinoExpandido] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicao, setModalEdicao] = useState<{ aberto: boolean; treino?: Treino }>({
    aberto: false
  });
  const [modalExclusao, setModalExclusao] = useState<{ aberto: boolean; treino?: Treino }>({
    aberto: false
  });
  const [erro, setErro] = useState<string>('');

  // Carregar treinos do usuário
  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        const treinosCarregados = carregarTreinosDoStorage();
        // Filtra apenas os treinos do usuário atual
        const treinosDoUsuario = usuario 
          ? treinosCarregados.filter(treino => treino.usuarioId === usuario.id)
          : [];
        setTreinos(treinosDoUsuario);
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
        setErro('Não foi possível carregar seus treinos. Tente novamente mais tarde.');
      }
    };

    carregarTreinos();
  }, [usuario?.id]);

  const treinosFiltrados = treinos
    .filter(treino => filtroTipo === 'todos' || treino.tipo === filtroTipo)
    .filter(treino => filtroStatus === 'todos' || treino.status === filtroStatus)
    .filter(treino => 
      busca === '' || 
      treino.nome.toLowerCase().includes(busca.toLowerCase()) ||
      treino.objetivo?.toLowerCase().includes(busca.toLowerCase())
    );

  const estatisticasTreinos = {
    total: treinos.length,
    concluidos: treinos.filter(t => t.status === 'concluido').length,
    emAndamento: treinos.filter(t => t.status === 'em_andamento').length,
    naoIniciados: treinos.filter(t => t.status === 'nao_iniciado').length
  };

  const handleIniciarTreino = async (treino: Treino) => {
    try {
      // TODO: Implementar chamada à API
      const treinoAtualizado = {
        ...treino,
        status: 'em_andamento' as StatusTreino,
        iniciadoEm: new Date()
      };
      setTreinos(prev => prev.map(t => 
        t.id === treino.id ? treinoAtualizado : t
      ));
    } catch (error) {
      console.error('Erro ao iniciar treino:', error);
    }
  };

  const handleConcluirTreino = async (treino: Treino) => {
    try {
      // TODO: Implementar chamada à API
      const treinoAtualizado = {
        ...treino,
        status: 'concluido' as StatusTreino,
        concluidoEm: new Date()
      };
      setTreinos(prev => prev.map(t => 
        t.id === treino.id ? treinoAtualizado : t
      ));
    } catch (error) {
      console.error('Erro ao concluir treino:', error);
    }
  };

  const handleNovoTreino = async (dados: DadosTreino) => {
    try {
      const novoTreino: Treino = {
        id: Math.random().toString(),
        usuarioId: usuario?.id || '',
        ...dados,
        criadoEm: new Date(),
        status: 'nao_iniciado',
        curtidas: 0,
        comentarios: []
      };

      const novosTreinos = [...treinos, novoTreino];
      setTreinos(novosTreinos);
      salvarTreinosNoStorage(novosTreinos);
      setModalAberto(false);
      setErro('');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      setErro('Não foi possível criar o treino. Tente novamente.');
    }
  };

  const handleEditarTreino = async (dados: DadosTreino) => {
    if (!modalEdicao.treino || !usuario) return;

    try {
      const treinoAtualizado = {
        ...modalEdicao.treino,
        ...dados,
        ultimaAtualizacao: new Date()
      };

      const novosTreinos = treinos.map(treino => 
        treino.id === modalEdicao.treino?.id 
          ? treinoAtualizado 
          : treino
      );

      // Atualiza o estado e persiste os dados
      setTreinos(novosTreinos);
      salvarTreinosNoStorage(novosTreinos);
      setModalEdicao({ aberto: false });
      setErro('');
    } catch (error) {
      console.error('Erro ao editar treino:', error);
      setErro('Não foi possível salvar as alterações. Tente novamente.');
    }
  };

  const handleExcluirTreino = async (treino: Treino) => {
    try {
      const novosTreinos = treinos.filter(t => t.id !== treino.id);
      setTreinos(novosTreinos);
      salvarTreinosNoStorage(novosTreinos);
      setModalExclusao({ aberto: false });
      setErro('');
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      setErro('Não foi possível excluir o treino. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {erro}
        </div>
      )}
      
      {/* Cabeçalho com Estatísticas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
            <div className="mt-2">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as StatusTreino | 'todos')}
                className="text-sm text-gray-600 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-gray-900"
              >
                <option value="todos">Total: {estatisticasTreinos.total} treinos</option>
                <option value="concluido">Concluídos: {estatisticasTreinos.concluidos}</option>
                <option value="em_andamento">Em andamento: {estatisticasTreinos.emAndamento}</option>
                <option value="nao_iniciado">Não iniciados: {estatisticasTreinos.naoIniciados}</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Treino
          </button>
        </div>

        {/* Barra de busca e filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar treinos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                filtroTipo === 'todos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Todos
            </button>
            {(['forca', 'cardio', 'hiit', 'yoga'] as TipoTreino[]).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filtroTipo === tipo 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } capitalize`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Treinos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treinosFiltrados.map((treino) => (
          <div
            key={treino.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Cabeçalho do Card */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{treino.nome}</h3>
                  <p className="text-gray-600 text-sm capitalize">{treino.nivel}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalEdicao({ aberto: true, treino })}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Editar treino"
                  >
                    <Pencil className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setModalExclusao({ aberto: true, treino })}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Excluir treino"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              
              {/* Tags e Objetivo */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-sm font-medium
                    ${treino.tipo === 'forca' 
                      ? 'bg-orange-100 text-orange-700' 
                      : treino.tipo === 'cardio'
                      ? 'bg-emerald-100 text-emerald-700'
                      : treino.tipo === 'hiit'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                    } capitalize
                  `}>
                    {treino.tipo === 'outro' ? treino.tipoPersonalizado : treino.tipo}
                  </span>
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-sm font-medium
                    ${treino.status === 'concluido'
                      ? 'bg-green-100 text-green-700'
                      : treino.status === 'em_andamento'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {treino.status === 'concluido' 
                      ? 'Concluído'
                      : treino.status === 'em_andamento'
                      ? 'Em andamento'
                      : 'Não iniciado'
                    }
                  </span>
                </div>
                {treino.objetivo && (
                  <p className="text-gray-600 text-sm">{treino.objetivo}</p>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{treino.duracao} minutos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ListChecks className="w-4 h-4" />
                  <span>{treino.exercicios.length} exercícios</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setTreinoExpandido(treinoExpandido === treino.id ? null : treino.id)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  Detalhes
                  {treinoExpandido === treino.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {treino.status === 'nao_iniciado' && (
                  <button
                    onClick={() => handleIniciarTreino(treino)}
                    className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <Play className="w-4 h-4" />
                    Iniciar
                  </button>
                )}
                {treino.status === 'em_andamento' && (
                  <button
                    onClick={() => handleConcluirTreino(treino)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Concluir
                  </button>
                )}
              </div>
            </div>

            {/* Detalhes Expandidos */}
            {treinoExpandido === treino.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição</h4>
                    <p className="text-sm text-gray-600">{treino.descricao}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Exercícios</h4>
                    <div className="space-y-2">
                      {treino.exercicios.map((exercicio, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">{exercicio.nome}</h5>
                              <p className="text-sm text-gray-600">
                                {exercicio.series} séries x {exercicio.repeticoes} repetições
                                {exercicio.peso ? ` • ${exercicio.peso}kg` : ''}
                              </p>
                              {exercicio.observacoes && (
                                <p className="text-sm text-gray-500 mt-1">{exercicio.observacoes}</p>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {exercicio.descanso}s descanso
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {treino.status !== 'nao_iniciado' && (
                    <div className="text-sm text-gray-500">
                      {treino.iniciadoEm && (
                        <p>Iniciado em: {new Date(treino.iniciadoEm).toLocaleString()}</p>
                      )}
                      {treino.concluidoEm && (
                        <p>Concluído em: {new Date(treino.concluidoEm).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {treinosFiltrados.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum treino encontrado</h3>
            <p className="text-gray-600">
              {busca 
                ? 'Tente ajustar seus filtros de busca'
                : 'Clique em "Novo Treino" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Modal Novo Treino */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo Treino"
      >
        <FormularioTreino onSubmit={handleNovoTreino} />
      </Modal>

      {/* Modal Edição */}
      <Modal
        isOpen={modalEdicao.aberto}
        onClose={() => setModalEdicao({ aberto: false })}
        title="Editar Treino"
      >
        <FormularioTreino
          onSubmit={handleEditarTreino}
          treinoInicial={modalEdicao.treino}
        />
      </Modal>

      {/* Modal Exclusão */}
      <Modal
        isOpen={modalExclusao.aberto}
        onClose={() => setModalExclusao({ aberto: false })}
        title="Excluir Treino"
      >
        <div className="text-center">
          <div className="mb-6">
            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar exclusão</h3>
            <p className="text-gray-600">
              Tem certeza que deseja excluir o treino "{modalExclusao.treino?.nome}"?<br />
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setModalExclusao({ aberto: false })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => modalExclusao.treino && handleExcluirTreino(modalExclusao.treino)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}