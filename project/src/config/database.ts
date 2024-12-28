import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any = null;

export async function getDb() {
  if (db) {
    return db;
  }

  const dbPath = path.resolve(__dirname, '../../db/socialfit.db');

  // Garante que o diretório existe
  const dbDir = path.dirname(dbPath);
  if (!await exists(dbDir)) {
    await mkdir(dbDir, { recursive: true });
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Habilita as foreign keys
  await db.run('PRAGMA foreign_keys = ON');

  return db;
}

export async function closeDb() {
  if (db) {
    await db.close();
    db = null;
  }
}

// Funções auxiliares para manipulação de arquivos
async function exists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}

async function mkdir(path: string, options: { recursive: boolean }) {
  await fs.promises.mkdir(path, options);
}