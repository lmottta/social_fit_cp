import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do banco de dados
const dbDir = path.resolve(__dirname, '../db');
const dbPath = path.resolve(dbDir, 'socialfit.db');

// Garantir que o diretório existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

async function setupDatabase() {
  try {
    // Abrir conexão com o banco
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Habilitar chaves estrangeiras
    await db.exec('PRAGMA foreign_keys = ON');

    // Criar tabelas
    await db.exec(`
      -- Tabela de Usuários
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo_usuario TEXT NOT NULL DEFAULT 'aluno',
        foto_perfil TEXT,
        bio TEXT,
        cidade TEXT,
        estado TEXT,
        modalidades TEXT,
        instagram TEXT,
        whatsapp TEXT,
        anamnese_completa INTEGER DEFAULT 0,
        idade TEXT,
        altura TEXT,
        peso TEXT,
        objetivos TEXT,
        restricoes TEXT,
        experiencia TEXT,
        frequencia TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
    `);

    console.log('Banco de dados configurado com sucesso!');
    await db.close();
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

// Executar a configuração
setupDatabase();