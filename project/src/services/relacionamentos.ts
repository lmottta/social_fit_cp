interface Relacionamento {
  seguidorId: string;
  seguidoId: string;
  criadoEm: Date;
}

// Simula um banco de dados de relacionamentos
const STORAGE_KEY = 'social_fit_relacionamentos';

// Função para carregar dados do localStorage
function carregarDados(): {
  relacionamentos: Relacionamento[];
  contadores: Record<string, { seguidores: number; seguindo: number }>;
} {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (!dadosSalvos) {
      return {
        relacionamentos: [],
        contadores: {}
      };
    }

    const dados = JSON.parse(dadosSalvos);
    return {
      relacionamentos: dados.relacionamentos.map((r: any) => ({
        ...r,
        criadoEm: new Date(r.criadoEm)
      })),
      contadores: dados.contadores || {}
    };
  } catch (error) {
    console.error('Erro ao carregar dados de relacionamentos:', error);
    return {
      relacionamentos: [],
      contadores: {}
    };
  }
}

// Função para salvar dados no localStorage
function salvarDados(dados: {
  relacionamentos: Relacionamento[];
  contadores: Record<string, { seguidores: number; seguindo: number }>;
}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (error) {
    console.error('Erro ao salvar dados de relacionamentos:', error);
  }
}

// Carrega os dados iniciais
let dadosDB = carregarDados();

// Função para atualizar contadores
function atualizarContadores(seguidorId: string, seguidoId: string, incremento: number) {
  // Inicializa contadores se não existirem
  if (!dadosDB.contadores[seguidorId]) {
    dadosDB.contadores[seguidorId] = { seguidores: 0, seguindo: 0 };
  }
  if (!dadosDB.contadores[seguidoId]) {
    dadosDB.contadores[seguidoId] = { seguidores: 0, seguindo: 0 };
  }

  // Atualiza contadores
  dadosDB.contadores[seguidorId].seguindo += incremento;
  dadosDB.contadores[seguidoId].seguidores += incremento;
}

// Seguir um usuário
export async function seguirUsuario(seguidorId: string, seguidoId: string): Promise<void> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Recarrega os dados
  dadosDB = carregarDados();

  // Verifica se já segue
  const jaSegue = dadosDB.relacionamentos.some(
    r => r.seguidorId === seguidorId && r.seguidoId === seguidoId
  );

  if (jaSegue) {
    throw new Error('Você já segue este usuário');
  }

  // Adiciona novo relacionamento
  dadosDB.relacionamentos.push({
    seguidorId,
    seguidoId,
    criadoEm: new Date()
  });

  // Atualiza contadores
  atualizarContadores(seguidorId, seguidoId, 1);

  // Salva os dados
  salvarDados(dadosDB);
}

// Deixar de seguir um usuário
export async function deixarDeSeguir(seguidorId: string, seguidoId: string): Promise<void> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Recarrega os dados
  dadosDB = carregarDados();

  // Encontra e remove o relacionamento
  const index = dadosDB.relacionamentos.findIndex(
    r => r.seguidorId === seguidorId && r.seguidoId === seguidoId
  );

  if (index === -1) {
    throw new Error('Você não segue este usuário');
  }

  dadosDB.relacionamentos.splice(index, 1);

  // Atualiza contadores
  atualizarContadores(seguidorId, seguidoId, -1);

  // Salva os dados
  salvarDados(dadosDB);
}

// Verificar se um usuário segue outro
export async function verificarSeSegue(seguidorId: string, seguidoId: string): Promise<boolean> {
  // Recarrega os dados
  dadosDB = carregarDados();

  return dadosDB.relacionamentos.some(
    r => r.seguidorId === seguidorId && r.seguidoId === seguidoId
  );
}

// Obter contadores de um usuário
export async function obterContadores(usuarioId: string): Promise<{ seguidores: number; seguindo: number }> {
  // Recarrega os dados
  dadosDB = carregarDados();

  return dadosDB.contadores[usuarioId] || { seguidores: 0, seguindo: 0 };
}

// Obter seguidores de um usuário
export async function obterSeguidores(usuarioId: string): Promise<string[]> {
  // Recarrega os dados
  dadosDB = carregarDados();

  return dadosDB.relacionamentos
    .filter(r => r.seguidoId === usuarioId)
    .map(r => r.seguidorId);
}

// Obter usuários que um usuário segue
export async function obterSeguindo(usuarioId: string): Promise<string[]> {
  // Recarrega os dados
  dadosDB = carregarDados();

  return dadosDB.relacionamentos
    .filter(r => r.seguidorId === usuarioId)
    .map(r => r.seguidoId);
}

// Verificar se um usuário segue outro
export async function verificarSeguindo(seguidorId: string, seguidoId: string): Promise<boolean> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Recarrega os dados
  dadosDB = carregarDados();

  // Verifica se existe o relacionamento
  return dadosDB.relacionamentos.some(
    r => r.seguidorId === seguidorId && r.seguidoId === seguidoId
  );
} 