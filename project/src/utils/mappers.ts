import { Usuario } from '../types/usuario';

export function mapDatabaseUserToModel(dbUser: any): Usuario {
  return {
    id: dbUser.id.toString(),
    nome: dbUser.nome,
    email: dbUser.email,
    tipoUsuario: dbUser.tipo_usuario,
    anamneseCompleta: Boolean(dbUser.anamnese_completa),
    anamnese: dbUser.anamnese_completa ? {
      idade: dbUser.idade,
      altura: dbUser.altura,
      peso: dbUser.peso,
      objetivos: dbUser.objetivos,
      restricoes: dbUser.restricoes,
      experiencia: dbUser.experiencia,
      frequencia: dbUser.frequencia
    } : undefined,
    perfil: {
      bio: dbUser.bio,
      avatar: dbUser.foto_perfil,
      cidade: dbUser.cidade,
      estado: dbUser.estado,
      modalidades: dbUser.modalidades ? JSON.parse(dbUser.modalidades) : [],
      instagram: dbUser.instagram,
      whatsapp: dbUser.whatsapp
    }
  };
}
