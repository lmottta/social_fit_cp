import { getAuthToken } from '../utils/auth';

interface Comentario {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  avatarUsuario?: string;
  texto: string;
  criadoEm: Date;
}

interface Interacao {
  curtidas: string[];
  comentarios: Comentario[];
}

// Simula um banco de dados de interações
const STORAGE_KEY = 'social_fit_interacoes';

// Função para carregar dados do localStorage
function carregarDados(): Map<string, Interacao> {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (!dadosSalvos) {
      return new Map();
    }

    const dados = JSON.parse(dadosSalvos);
    return new Map(Object.entries(dados));
  } catch (error) {
    console.error('Erro ao carregar dados de interações:', error);
    return new Map();
  }
}

// Função para salvar dados no localStorage
function salvarDados(dados: Map<string, Interacao>) {
  try {
    const dadosObj = Object.fromEntries(dados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosObj));
  } catch (error) {
    console.error('Erro ao salvar dados de interações:', error);
  }
}

// Carrega os dados iniciais
let dadosDB = carregarDados();

// Função para garantir que a atividade existe no banco
function garantirAtividade(atividadeId: string) {
  if (!dadosDB.has(atividadeId)) {
    dadosDB.set(atividadeId, {
      curtidas: [],
      comentarios: []
    });
    salvarDados(dadosDB);
  }
}

// Alternar curtida
export async function alternarCurtida(atividadeId: string, usuarioId: string): Promise<{ curtido: boolean; totalCurtidas: number }> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Recarrega os dados
  dadosDB = carregarDados();
  garantirAtividade(atividadeId);

  const interacao = dadosDB.get(atividadeId)!;
  const index = interacao.curtidas.indexOf(usuarioId);

  if (index === -1) {
    interacao.curtidas.push(usuarioId);
  } else {
    interacao.curtidas.splice(index, 1);
  }

  salvarDados(dadosDB);

  return {
    curtido: index === -1,
    totalCurtidas: interacao.curtidas.length
  };
}

// Verificar se usuário curtiu
export async function verificarCurtida(atividadeId: string, usuarioId: string): Promise<boolean> {
  // Recarrega os dados
  dadosDB = carregarDados();
  garantirAtividade(atividadeId);

  const interacao = dadosDB.get(atividadeId)!;
  return interacao.curtidas.includes(usuarioId);
}

// Obter total de curtidas
export async function obterTotalCurtidas(atividadeId: string): Promise<number> {
  // Recarrega os dados
  dadosDB = carregarDados();
  garantirAtividade(atividadeId);

  const interacao = dadosDB.get(atividadeId)!;
  return interacao.curtidas.length;
}

// Adicionar comentário
export async function adicionarComentario(
  atividadeId: string,
  usuarioId: string,
  texto: string,
  nomeUsuario: string,
  avatarUsuario?: string
): Promise<Comentario> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Recarrega os dados
  dadosDB = carregarDados();
  garantirAtividade(atividadeId);

  const interacao = dadosDB.get(atividadeId)!;
  const novoComentario: Comentario = {
    id: Math.random().toString(36).substr(2, 9),
    usuarioId,
    nomeUsuario,
    avatarUsuario,
    texto,
    criadoEm: new Date()
  };

  interacao.comentarios.push(novoComentario);
  salvarDados(dadosDB);

  return novoComentario;
}

// Remover comentário
export async function removerComentario(
  atividadeId: string,
  comentarioId: string,
  usuarioId: string
): Promise<void> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Recarrega os dados
  dadosDB = carregarDados();
  garantirAtividade(atividadeId);

  const interacao = dadosDB.get(atividadeId)!;
  const index = interacao.comentarios.findIndex(c => c.id === comentarioId && c.usuarioId === usuarioId);

  if (index === -1) {
    throw new Error('Comentário não encontrado ou você não tem permissão para removê-lo');
  }

  interacao.comentarios.splice(index, 1);
  salvarDados(dadosDB);
}

// Obter comentários
export async function obterComentarios(atividadeId: string): Promise<Comentario[]> {
  // Recarrega os dados
  dadosDB = carregarDados();
  garantirAtividade(atividadeId);

  const interacao = dadosDB.get(atividadeId)!;
  return interacao.comentarios;
} 