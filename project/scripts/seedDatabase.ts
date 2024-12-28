import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Configuração do banco de dados
const dbPath = path.resolve(__dirname, '../db/socialfit.db');

async function seedDatabase() {
  try {
    // Abrir conexão com o banco
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Hash para senha padrão '123456'
    const senhaHash = await bcrypt.hash('123456', 10);

    // Limpar dados existentes
    await db.exec(`
      DELETE FROM seguidores;
      DELETE FROM curtidas;
      DELETE FROM comentarios;
      DELETE FROM posts;
      DELETE FROM usuarios;
    `);

    // Inserir usuários
    const usuarios = [
      {
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: senhaHash,
        tipo_usuario: 'aluno',
        foto_perfil: 'https://i.pravatar.cc/150?u=joao',
        bio: 'Apaixonado por musculação',
        cidade: 'São Paulo',
        estado: 'SP',
        modalidades: JSON.stringify(['Musculação', 'CrossFit']),
        instagram: '@joao.fit',
        whatsapp: '11999999999',
        anamnese_completa: 1,
        idade: '25',
        altura: '1.80',
        peso: '80',
        objetivos: 'Ganho de massa muscular',
        restricoes: 'Nenhuma',
        experiencia: 'Intermediário',
        frequencia: '5x por semana'
      },
      {
        nome: 'Maria Santos',
        email: 'maria@example.com',
        senha: senhaHash,
        tipo_usuario: 'educador',
        foto_perfil: 'https://i.pravatar.cc/150?u=maria',
        bio: 'Personal Trainer especializada em treinos funcionais',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        modalidades: JSON.stringify(['Funcional', 'Pilates']),
        instagram: '@maria.trainer',
        whatsapp: '21999999999'
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@example.com',
        senha: senhaHash,
        tipo_usuario: 'aluno',
        foto_perfil: 'https://i.pravatar.cc/150?u=pedro',
        bio: 'Iniciante em busca de uma vida mais saudável',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        modalidades: JSON.stringify(['Musculação']),
        instagram: '@pedro.fit',
        whatsapp: '31999999999'
      }
    ];

    const stmtUsuario = await db.prepare(`
      INSERT INTO usuarios (
        nome, email, senha, tipo_usuario, foto_perfil, bio,
        cidade, estado, modalidades, instagram, whatsapp,
        anamnese_completa, idade, altura, peso, objetivos,
        restricoes, experiencia, frequencia
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const usuario of usuarios) {
      await stmtUsuario.run(
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.tipo_usuario,
        usuario.foto_perfil,
        usuario.bio,
        usuario.cidade,
        usuario.estado,
        usuario.modalidades,
        usuario.instagram,
        usuario.whatsapp,
        usuario.anamnese_completa || 0,
        usuario.idade || null,
        usuario.altura || null,
        usuario.peso || null,
        usuario.objetivos || null,
        usuario.restricoes || null,
        usuario.experiencia || null,
        usuario.frequencia || null
      );
    }

    await stmtUsuario.finalize();

    // Inserir posts
    const posts = [
      {
        usuario_id: 1,
        conteudo: 'Mais um treino incrível hoje! 💪 #nopainnogain',
        imagem: 'https://source.unsplash.com/random/800x600/?workout',
        privado: 0
      },
      {
        usuario_id: 2,
        conteudo: 'Dicas para melhorar sua postura durante os exercícios 📝',
        imagem: 'https://source.unsplash.com/random/800x600/?fitness',
        privado: 0
      },
      {
        usuario_id: 3,
        conteudo: 'Primeiro dia de treino! Muito feliz em começar essa jornada 🎉',
        imagem: 'https://source.unsplash.com/random/800x600/?gym',
        privado: 0
      }
    ];

    const stmtPost = await db.prepare(`
      INSERT INTO posts (usuario_id, conteudo, imagem, privado)
      VALUES (?, ?, ?, ?)
    `);

    for (const post of posts) {
      await stmtPost.run(
        post.usuario_id,
        post.conteudo,
        post.imagem,
        post.privado
      );
    }

    await stmtPost.finalize();

    // Inserir comentários
    const comentarios = [
      {
        post_id: 1,
        usuario_id: 2,
        texto: 'Parabéns pelo progresso! Continue assim! 👏'
      },
      {
        post_id: 1,
        usuario_id: 3,
        texto: 'Muito bom! Me inspira a treinar mais! 💪'
      },
      {
        post_id: 2,
        usuario_id: 1,
        texto: 'Ótimas dicas! Vou implementar no meu treino'
      }
    ];

    const stmtComentario = await db.prepare(`
      INSERT INTO comentarios (post_id, usuario_id, texto)
      VALUES (?, ?, ?)
    `);

    for (const comentario of comentarios) {
      await stmtComentario.run(
        comentario.post_id,
        comentario.usuario_id,
        comentario.texto
      );
    }

    await stmtComentario.finalize();

    // Inserir curtidas
    const curtidas = [
      { post_id: 1, usuario_id: 2 },
      { post_id: 1, usuario_id: 3 },
      { post_id: 2, usuario_id: 1 },
      { post_id: 2, usuario_id: 3 },
      { post_id: 3, usuario_id: 1 },
      { post_id: 3, usuario_id: 2 }
    ];

    const stmtCurtida = await db.prepare(`
      INSERT INTO curtidas (post_id, usuario_id)
      VALUES (?, ?)
    `);

    for (const curtida of curtidas) {
      await stmtCurtida.run(
        curtida.post_id,
        curtida.usuario_id
      );
    }

    await stmtCurtida.finalize();

    // Inserir seguidores
    const seguidores = [
      { seguidor_id: 1, seguindo_id: 2 },
      { seguidor_id: 1, seguindo_id: 3 },
      { seguidor_id: 2, seguindo_id: 1 },
      { seguidor_id: 3, seguindo_id: 1 },
      { seguidor_id: 3, seguindo_id: 2 }
    ];

    const stmtSeguidor = await db.prepare(`
      INSERT INTO seguidores (seguidor_id, seguindo_id)
      VALUES (?, ?)
    `);

    for (const seguidor of seguidores) {
      await stmtSeguidor.run(
        seguidor.seguidor_id,
        seguidor.seguindo_id
      );
    }

    await stmtSeguidor.finalize();

    await db.close();
    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    process.exit(1);
  }
}

// Executar o seed
seedDatabase(); 