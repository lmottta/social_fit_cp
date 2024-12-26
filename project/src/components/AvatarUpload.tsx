import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadAvatar, deleteAvatar } from '../services/upload';
import { atualizarPerfil } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

interface AvatarUploadProps {
  onUploadStart?: () => void;
  onUploadComplete?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
}

export default function AvatarUpload({ onUploadStart, onUploadComplete, onError }: AvatarUploadProps) {
  const { usuario, login } = useAuth();
  const [preview, setPreview] = useState<string | null>(usuario?.perfil?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario?.id) return;

    // Validação do tipo de arquivo
    if (!file.type.startsWith('image/')) {
      onError?.('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validação do tamanho do arquivo
    if (file.size > 5 * 1024 * 1024) {
      onError?.('O arquivo deve ter no máximo 5MB.');
      return;
    }

    try {
      setUploading(true);
      onUploadStart?.();

      // Upload do novo avatar
      const avatarUrl = await uploadAvatar(file, usuario.id);

      // Atualiza o perfil do usuário com a nova URL
      const usuarioAtualizado = await atualizarPerfil(usuario.id, {
        avatar: avatarUrl
      });

      // Atualiza o estado global do usuário
      login('token-atualizado', usuarioAtualizado, false);
      
      // Atualiza o preview
      setPreview(avatarUrl);
      onUploadComplete?.(avatarUrl);
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error.message);
      } else {
        onError?.('Erro ao fazer upload do avatar');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!usuario?.id || !preview) return;

    try {
      setUploading(true);
      onUploadStart?.();

      // Remove o avatar atual
      await deleteAvatar(usuario.id);

      // Atualiza o perfil do usuário removendo a URL do avatar
      const usuarioAtualizado = await atualizarPerfil(usuario.id, {
        avatar: ''
      });

      // Atualiza o estado global do usuário
      login('token-atualizado', usuarioAtualizado, false);
      
      // Limpa o preview
      setPreview(null);
      onUploadComplete?.('');
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error.message);
      } else {
        onError?.('Erro ao remover avatar');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Avatar
      </label>

      <div className="flex items-center gap-4">
        {/* Preview do Avatar */}
        <div className="relative w-20 h-20">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Avatar"
                className={`w-20 h-20 rounded-full object-cover ${uploading ? 'opacity-50' : ''}`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Botão de remover */}
          {preview && !uploading && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={uploading}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
              title="Remover avatar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Botão de Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Carregar foto</span>
              </>
            )}
          </button>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG ou GIF (max. 5MB)
          </p>
        </div>
      </div>
    </div>
  );
} 