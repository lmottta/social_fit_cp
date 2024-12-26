export type TipoTreino = 'forca' | 'cardio' | 'hiit' | 'yoga' | 'funcional' | 'pilates' | 'crossfit' | 'outro';
export type Intensidade = 'baixa' | 'media' | 'alta';
export type StatusTreino = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Exercicio {
  nome: string;
  series: number;
  repeticoes: number;
  peso?: number;
  descanso: number;
  observacoes?: string;
}

export interface Treino {
  id: string;
  usuarioId: string;
  nome: string;
  tipo: TipoTreino;
  tipoPersonalizado?: string;
  duracao: number;
  nivel: string;
  intensidade: Intensidade;
  objetivo: string;
  descricao: string;
  exercicios: Exercicio[];
  criadoEm: Date;
  status: StatusTreino;
  iniciadoEm?: Date;
  concluidoEm?: Date;
  curtidas: number;
  comentarios: Comentario[];
}

export interface Comentario {
  id: string;
  usuarioId: string;
  texto: string;
  criadoEm: Date;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar: string;
  nivel: number;
  especialidades: string[];
  conquistas: Conquista[];
  estatisticas: EstatisticasUsuario;
}

export interface Conquista {
  titulo: string;
  descricao: string;
}

export interface EstatisticasUsuario {
  treinosTotal: number;
  minutosTotal: number;
  sequenciaAtual: number;
  rankingMensal: number;
} 