import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

let db: any = null;

export async function getDatabase() {
  if (!db) {
    const dbPath = path.resolve(process.cwd(), 'db/socialfit.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    await db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}

// Garantir que o banco seja fechado quando a aplicação for encerrada
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit();
}); 