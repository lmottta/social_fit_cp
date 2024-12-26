import sequelize from '../config/database';
import { Perfil, Anamnese, Exercicio, Treino, ExercicioTreino, Conquista, RecursoSocial } from '../models';

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
}

syncDatabase();
