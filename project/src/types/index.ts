export interface Usuario {
  id: string;
  nome: string;
  avatar: string;
  nivel: number;
  especialidades: string[];
  conquistas: Conquista[];
  estatisticas: EstatisticasUsuario;
}

export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  desbloqueadoEm?: Date;
}

export interface EstatisticasUsuario {
  totalTreinos: number;
  totalMinutos: number;
  sequenciaSemanal: number;
  rankingMensal: number;
}

export interface Treino {
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

export type TipoTreino = 'forca' | 'cardio' | 'flexibilidade' | 'hiit' | 'yoga';

export interface Exercicio {
  nome: string;
  series: number;
  repeticoes: number;
  peso: number;
}

export interface Comentario {
  id: string;
  usuarioId: string;
  conteudo: string;
  criadoEm: Date;
}