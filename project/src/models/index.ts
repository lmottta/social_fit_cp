import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Perfil = sequelize.define('Perfil', {
  nome: DataTypes.STRING,
  email: DataTypes.STRING,
  senha: DataTypes.STRING,
  avatar: DataTypes.STRING,
  nivel: DataTypes.INTEGER
});

const Anamnese = sequelize.define('Anamnese', {
  idade: DataTypes.INTEGER,
  peso: DataTypes.FLOAT,
  altura: DataTypes.FLOAT,
  objetivo: DataTypes.STRING,
  nivelAtividade: DataTypes.STRING,
  restricoes: DataTypes.STRING,
  diasDisponiveis: DataTypes.INTEGER
});

const Exercicio = sequelize.define('Exercicio', {
  nome: DataTypes.STRING,
  descricao: DataTypes.STRING
});

const Treino = sequelize.define('Treino', {
  nome: DataTypes.STRING,
  tipo: DataTypes.STRING,
  duracao: DataTypes.INTEGER,
  intensidade: DataTypes.STRING
});

const ExercicioTreino = sequelize.define('ExercicioTreino', {
  series: DataTypes.INTEGER,
  repeticoes: DataTypes.INTEGER,
  peso: DataTypes.FLOAT
});

const Conquista = sequelize.define('Conquista', {
  titulo: DataTypes.STRING,
  descricao: DataTypes.STRING
});

const RecursoSocial = sequelize.define('RecursoSocial', {
  tipo: DataTypes.STRING,
  usuarioId: DataTypes.INTEGER
});

// Relacionamentos
Perfil.hasMany(Anamnese);
Perfil.hasMany(Treino);
Perfil.hasMany(Conquista);
Perfil.hasMany(RecursoSocial);

Treino.belongsToMany(Exercicio, { through: ExercicioTreino });
Exercicio.belongsToMany(Treino, { through: ExercicioTreino });

export { Perfil, Anamnese, Exercicio, Treino, ExercicioTreino, Conquista, RecursoSocial }; 