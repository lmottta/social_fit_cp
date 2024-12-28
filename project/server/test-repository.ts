import { Database } from './database';
import { UserRepository } from './repositories/userRepository';

async function testUserRepository() {
  try {
    // 1. Obter instância do banco de dados
    console.log('Conectando ao banco de dados...');
    const db = await Database.getInstance();
    
    // 2. Criar instância do repositório
    console.log('Criando repositório de usuários...');
    const userRepo = new UserRepository(db);

    // 3. Criar um novo usuário
    console.log('\nCriando novo usuário...');
    const newUser = await userRepo.create({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: '123456',
      tipo_usuario: 'aluno'
    });
    console.log('Usuário criado:', { ...newUser, senha: '[PROTEGIDA]' });

    // 4. Buscar usuário por email
    console.log('\nBuscando usuário por email...');
    const foundUser = await userRepo.findByEmail('teste@email.com');
    console.log('Usuário encontrado:', foundUser ? { ...foundUser, senha: '[PROTEGIDA]' } : null);

    // 5. Atualizar usuário
    console.log('\nAtualizando usuário...');
    const updatedUser = await userRepo.update(newUser.id, {
      nome: 'Usuário Atualizado',
      tipo_usuario: 'professor'
    });
    console.log('Usuário atualizado:', updatedUser ? { ...updatedUser, senha: '[PROTEGIDA]' } : null);

    // 6. Listar todos os usuários
    console.log('\nListando todos os usuários...');
    const allUsers = await userRepo.list();
    console.log('Total de usuários:', allUsers.length);
    console.log('Usuários:', allUsers.map(u => ({ ...u, senha: '[PROTEGIDA]' })));

    // 7. Validar senha
    console.log('\nValidando senha...');
    const isValidPassword = await userRepo.validatePassword(newUser, '123456');
    console.log('Senha válida:', isValidPassword);

    // 8. Deletar usuário
    console.log('\nDeletando usuário...');
    await userRepo.delete(newUser.id);
    console.log('Usuário deletado com sucesso');

    // 9. Verificar se usuário foi deletado
    console.log('\nVerificando se usuário foi deletado...');
    const deletedUser = await userRepo.findById(newUser.id);
    console.log('Usuário após deleção:', deletedUser);

  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

// Executar o teste
console.log('Iniciando teste do repositório de usuários...\n');
testUserRepository().then(() => {
  console.log('\nTeste concluído!');
});
