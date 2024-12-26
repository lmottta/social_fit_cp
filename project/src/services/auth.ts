interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'aluno' | 'educador';
  anamneseCompleta?: boolean;
  anamnese?: {
    idade: string;
    altura: string;
    peso: string;
    objetivos: string;
    restricoes: string;
    experiencia: string;
    frequencia: string;
  };
  perfil?: {
    bio?: string;
    avatar?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    cidade?: string;
    estado?: string;
    academia?: string;
    modalidades?: string[];
    outraModalidade?: string;
  };
  estatisticas?: {
    totalTreinos: string;
    minutosTotais: string;
  };
}

interface RespostaAuth {
  usuario: Usuario;
  token: string;
}

// Função para carregar dados do localStorage
function carregarDadosUsuarios(): Map<string, any> {
  try {
    const dadosSalvos = localStorage.getItem('usuarios_db');
    if (!dadosSalvos) {
      return new Map();
    }
    // Tenta converter os dados salvos em um Map
    try {
      const dadosArray = JSON.parse(dadosSalvos);
      if (Array.isArray(dadosArray)) {
        return new Map(dadosArray);
      } else {
        console.error('Dados salvos não estão no formato esperado');
        return new Map();
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse dos dados:', parseError);
      return new Map();
    }
  } catch (error) {
    console.error('Erro ao carregar dados dos usuários:', error);
    return new Map();
  }
}

// Função para salvar dados no localStorage
function salvarDadosUsuarios(dados: Map<string, any>) {
  try {
    if (!(dados instanceof Map)) {
      throw new Error('Dados devem ser uma instância de Map');
    }
    const dadosArray = Array.from(dados.entries());
    localStorage.setItem('usuarios_db', JSON.stringify(dadosArray));
  } catch (error) {
    console.error('Erro ao salvar dados dos usuários:', error);
    throw new Error('Erro ao salvar dados. Tente novamente.');
  }
}

// Inicializa o banco de dados com dados do localStorage
let usuariosDB = carregarDadosUsuarios();

// Lista de modalidades disponíveis
export const MODALIDADES = [
  'Musculação',
  'CrossFit',
  'Corrida',
  'Natação',
  'Ciclismo',
  'Yoga',
  'Pilates',
  'Funcional',
  'Lutas',
  'Dança',
  'Outro'
];

// Lista de estados brasileiros
export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export async function login(email: string, senha: string): Promise<RespostaAuth> {
  try {
    // Recarrega os dados mais recentes
    usuariosDB = carregarDadosUsuarios();

    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Converte para array e procura o usuário
    const usuarioEncontrado = Array.from(usuariosDB.entries()).find(
      ([_, user]) => user.email.toLowerCase() === email.toLowerCase() && user.senha === senha
    );

    if (!usuarioEncontrado) {
      throw new Error('Email ou senha incorretos');
    }

    const [id, usuario] = usuarioEncontrado;

    // Retorna os dados do usuário sem a senha
    const { senha: _, ...usuarioSemSenha } = usuario;
    return {
      usuario: {
        id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        anamneseCompleta: usuario.anamneseCompleta,
        anamnese: usuario.anamnese,
        perfil: usuario.perfil,
        estatisticas: usuario.estatisticas
      },
      token: `token-${Math.random()}`
    };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

export async function cadastrar(
  nome: string,
  email: string,
  senha: string,
  tipoUsuario: 'aluno' | 'educador'
): Promise<RespostaAuth> {
  try {
    // Validações adicionais
    if (!nome || nome.length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Email inválido');
    }

    if (!senha || senha.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres');
    }

    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Recarrega os dados mais recentes
    usuariosDB = carregarDadosUsuarios();

    // Verifica se já existe um usuário com este email
    const usuarioExistente = Array.from(usuariosDB.values()).find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (usuarioExistente) {
      throw new Error('Este email já está em uso');
    }

    // Gera um ID único
    const id = `user-${Date.now()}`;

    // Cria o novo usuário com dados iniciais
    const novoUsuario = {
      id,
      nome,
      email,
      senha,
      tipoUsuario,
      anamneseCompleta: false,
      perfil: {
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`,
      },
      estatisticas: {
        totalTreinos: '0',
        minutosTotais: '0',
      }
    };

    // Salva o novo usuário
    usuariosDB.set(id, novoUsuario);
    salvarDadosUsuarios(usuariosDB);

    // Retorna os dados do usuário sem a senha
    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    return {
      usuario: {
        id,
        nome,
        email,
        tipoUsuario,
        anamneseCompleta: false,
        perfil: novoUsuario.perfil,
        estatisticas: novoUsuario.estatisticas
      },
      token: `token-${Math.random()}`
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao criar conta. Tente novamente.');
  }
}

export async function atualizarAnamnese(
  userId: string,
  dadosAnamnese: {
    idade: string;
    altura: string;
    peso: string;
    objetivos: string;
    restricoes: string;
    experiencia: string;
    frequencia: string;
  }
): Promise<Usuario> {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  const usuario = usuariosDB.get(userId);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  usuario.anamneseCompleta = true;
  usuario.anamnese = dadosAnamnese;
  usuariosDB.set(userId, usuario);

  return {
    id: userId,
    nome: usuario.nome,
    email: usuario.email,
    tipoUsuario: usuario.tipoUsuario,
    anamneseCompleta: true,
    anamnese: dadosAnamnese,
    perfil: usuario.perfil
  };
}

export async function atualizarPerfil(
  userId: string,
  dadosPerfil: {
    nome?: string;
    bio?: string;
    avatar?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    cidade?: string;
    estado?: string;
    academia?: string;
    modalidades?: string[];
    outraModalidade?: string;
  }
): Promise<Usuario> {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  const usuario = usuariosDB.get(userId);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  // Atualiza os dados do perfil
  usuario.perfil = {
    ...usuario.perfil,
    ...dadosPerfil
  };

  if (dadosPerfil.nome) {
    usuario.nome = dadosPerfil.nome;
  }

  usuariosDB.set(userId, usuario);

  return {
    id: userId,
    nome: usuario.nome,
    email: usuario.email,
    tipoUsuario: usuario.tipoUsuario,
    anamneseCompleta: usuario.anamneseCompleta,
    anamnese: usuario.anamnese,
    perfil: usuario.perfil,
    estatisticas: usuario.estatisticas
  };
}

export async function buscarUsuario(id: string): Promise<Usuario> {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  const usuario = usuariosDB.get(id);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipoUsuario: usuario.tipoUsuario,
    anamneseCompleta: usuario.anamneseCompleta,
    anamnese: usuario.anamnese,
    perfil: usuario.perfil,
    estatisticas: usuario.estatisticas
  };
} 