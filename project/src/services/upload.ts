// Simula um armazenamento de arquivos
const filesDB = new Map<string, { data: string; type: string }>();

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  // Verifica o tipo do arquivo
  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo deve ser uma imagem');
  }

  // Verifica o tamanho do arquivo (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('O arquivo deve ter no máximo 5MB');
  }

  // Lê o arquivo como Data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });

  // Deleta o avatar anterior se existir
  const avatarKey = `avatar_${userId}`;
  if (filesDB.has(avatarKey)) {
    filesDB.delete(avatarKey);
  }

  // Salva o novo avatar
  filesDB.set(avatarKey, {
    data: dataUrl,
    type: file.type
  });

  return dataUrl;
}

export async function deleteAvatar(userId: string): Promise<void> {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  const avatarKey = `avatar_${userId}`;
  filesDB.delete(avatarKey);
} 