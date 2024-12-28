import { Database } from '../database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: string;
  created_at?: string;
  updated_at?: string;
}

export class UserRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    
    const result = await this.db.execute(
      `INSERT INTO usuarios (nome, email, senha, tipo_usuario, created_at, updated_at) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [userData.nome, userData.email, hashedPassword, userData.tipo_usuario]
    );

    return this.findById(result.lastID);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.queryOne('SELECT * FROM usuarios WHERE email = ?', [email]);
  }

  async findById(id: number): Promise<User | null> {
    return this.db.queryOne('SELECT * FROM usuarios WHERE id = ?', [id]);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const fields = Object.keys(userData)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = ?`);
    
    if (fields.length === 0) return this.findById(id);

    const values = Object.values(userData);
    
    await this.db.execute(
      `UPDATE usuarios SET ${fields.join(', ')}, updated_at = datetime('now') WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  }

  async list(): Promise<User[]> {
    return this.db.query('SELECT * FROM usuarios ORDER BY created_at DESC');
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.senha);
  }
}
