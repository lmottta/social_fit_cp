import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createUsersTable() {
  try {
    console.log('Iniciando migração da tabela de usuários...');
    
    const dbPath = resolve(__dirname, '../../db/socialfit.db');
    console.log('Caminho do banco de dados:', dbPath);
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Desabilitar verificação de chave estrangeira temporariamente
    await db.run('PRAGMA foreign_keys = OFF');

    // Drop table if exists
    await db.run(`DROP TABLE IF EXISTS usuarios`);

    // Create new table
    await db.run(`
      CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo_usuario TEXT NOT NULL,
        bio TEXT,
        foto_perfil TEXT,
        cidade TEXT,
        estado TEXT,
        modalidades TEXT,
        instagram TEXT,
        whatsapp TEXT,
        idade TEXT,
        altura TEXT,
        peso TEXT,
        objetivos TEXT,
        restricoes TEXT,
        experiencia TEXT,
        frequencia TEXT,
        anamnese_completa INTEGER DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reabilitar verificação de chave estrangeira
    await db.run('PRAGMA foreign_keys = ON');

    console.log('Tabela de usuários criada com sucesso!');
    await db.close();

  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
createUsersTable().then(() => {
  console.log('Migração concluída!');
  process.exit(0);
});
