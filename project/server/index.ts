import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as dotenv from 'dotenv';
import { Database } from './database';
import { UserRepository } from './repositories/userRepository';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega as variáveis de ambiente
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET || 'your-secret-key');
    req.userId = (decoded as any).id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Rotas de autenticação
app.post('/auth/register', async (req, res) => {
  try {
    const { nome, email, senha, tipoUsuario } = req.body;
    const db = await Database.getInstance();
    const userRepo = new UserRepository(db);

    // Verifica se o email já existe
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Cria o novo usuário
    const user = await userRepo.create({
      nome,
      email,
      senha,
      tipo_usuario: tipoUsuario
    });

    const token = jwt.sign({ id: user.id }, process.env.VITE_JWT_SECRET || 'your-secret-key');

    delete user.senha; // Remove a senha do objeto retornado
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const db = await Database.getInstance();
    const userRepo = new UserRepository(db);

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const validPassword = await userRepo.validatePassword(user, senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.VITE_JWT_SECRET || 'your-secret-key');

    delete user.senha; // Remove a senha do objeto retornado
    res.json({ user, token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas protegidas
app.get('/users/me', authMiddleware, async (req, res) => {
  try {
    const db = await Database.getInstance();
    const userRepo = new UserRepository(db);
    
    const user = await userRepo.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    delete user.senha;
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
  try {
    const db = await Database.getInstance();
    const userRepo = new UserRepository(db);
    
    const users = await userRepo.list();
    // Remove as senhas dos usuários antes de enviar
    const safeUsers = users.map(user => {
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializa a conexão com o banco de dados
    await Database.getInstance();
    console.log('Conexão com o banco de dados estabelecida');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
