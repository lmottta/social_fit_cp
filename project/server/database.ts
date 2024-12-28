import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Database {
  private static instance: Database;
  private db: any = null;

  private constructor() {}

  static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.connect();
    }
    return Database.instance;
  }

  private async connect() {
    if (this.db) return;

    const dbPath = resolve(__dirname, '../db/socialfit.db');
    console.log('Caminho do banco de dados:', dbPath);
    
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Habilita foreign keys
    await this.db.run('PRAGMA foreign_keys = ON');
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.all(sql, params);
    } catch (error) {
      console.error('Erro na query:', sql, error);
      throw error;
    }
  }

  async queryOne(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.get(sql, params);
    } catch (error) {
      console.error('Erro na query:', sql, error);
      throw error;
    }
  }

  async execute(sql: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.run(sql, params);
    } catch (error) {
      console.error('Erro na execução:', sql, error);
      throw error;
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.db.run('BEGIN TRANSACTION');
    try {
      const result = await callback();
      await this.db.run('COMMIT');
      return result;
    } catch (error) {
      await this.db.run('ROLLBACK');
      throw error;
    }
  }
}
