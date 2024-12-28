export interface Anamnese {
  idade?: string;
  altura?: string;
  peso?: string;
  objetivos?: string;
  restricoes?: string;
  experiencia?: string;
  frequencia?: string;
}

export interface Perfil {
  bio?: string;
  avatar?: string;
  cidade?: string;
  estado?: string;
  modalidades?: string[];
  instagram?: string;
  whatsapp?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'aluno' | 'educador';
  anamneseCompleta: boolean;
  anamnese?: Anamnese;
  perfil: Perfil;
}

export interface AuthResponse {
  user: Usuario;
  token: string;
}
