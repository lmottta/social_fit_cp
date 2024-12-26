import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarPerfil, MODALIDADES, ESTADOS } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import AvatarUpload from './AvatarUpload';

interface FormData {
  nome: string;
  bio: string;
  instagram: string;
  twitter: string;
  facebook: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  academia: string;
  modalidades: string[];
  outraModalidade: string;
  avatar: string;
}

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { usuario, login } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [formData, setFormData] = useState<FormData>({
    nome: usuario?.nome || '',
    bio: usuario?.perfil?.bio || '',
    instagram: usuario?.perfil?.instagram || '',
    twitter: usuario?.perfil?.twitter || '',
    facebook: usuario?.perfil?.facebook || '',
    whatsapp: usuario?.perfil?.whatsapp || '',
    cidade: usuario?.perfil?.cidade || '',
    estado: usuario?.perfil?.estado || '',
    academia: usuario?.perfil?.academia || '',
    modalidades: usuario?.perfil?.modalidades || [],
    outraModalidade: usuario?.perfil?.outraModalidade || '',
    avatar: usuario?.perfil?.avatar || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    setSucesso('');

    try {
      if (usuario?.id) {
        const usuarioAtualizado = await atualizarPerfil(usuario.id, {
          ...formData
        });
        login('token-atualizado', usuarioAtualizado, false);
        setSucesso('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setErro('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleModalidadeChange = (modalidade: string) => {
    const novasModalidades = formData.modalidades.includes(modalidade)
      ? formData.modalidades.filter((m: string) => m !== modalidade)
      : [...formData.modalidades, modalidade];
    
    setFormData({ ...formData, modalidades: novasModalidades });
  };

  const handleAvatarUploadComplete = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    setCarregando(false);
    setSucesso('Avatar atualizado com sucesso!');
    
    // Limpa a mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setSucesso('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Editar Perfil</h2>
          <p className="mt-2 text-gray-600">Atualize suas informações pessoais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {sucesso}
            </div>
          )}

          {/* Avatar Upload */}
          <AvatarUpload
            onUploadStart={() => {
              setCarregando(true);
              setErro('');
              setSucesso('');
            }}
            onUploadComplete={handleAvatarUploadComplete}
            onError={(error) => {
              setErro(error);
              setSucesso('');
            }}
          />

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={3}
                placeholder="Conte um pouco sobre você"
                disabled={carregando}
              />
            </div>
          </div>

          {/* Localização */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                disabled={carregando}
              >
                <option value="">Selecione um estado</option>
                {ESTADOS.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Academia */}
          <div>
            <label htmlFor="academia" className="block text-sm font-medium text-gray-700">
              Academia ou Grupo de Atividades
            </label>
            <input
              id="academia"
              type="text"
              value={formData.academia}
              onChange={(e) => setFormData({ ...formData, academia: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Nome da sua academia ou grupo"
              disabled={carregando}
            />
          </div>

          {/* Modalidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modalidades
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODALIDADES.map(modalidade => (
                <label
                  key={modalidade}
                  className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.modalidades.includes(modalidade)}
                    onChange={() => handleModalidadeChange(modalidade)}
                    disabled={carregando}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span>{modalidade}</span>
                </label>
              ))}
            </div>
            {formData.modalidades.includes('Outro') && (
              <input
                type="text"
                value={formData.outraModalidade}
                onChange={(e) => setFormData({ ...formData, outraModalidade: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Qual modalidade?"
                disabled={carregando}
              />
            )}
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                id="instagram"
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="@seu.usuario"
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                X.com (Twitter)
              </label>
              <input
                id="twitter"
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="@seu.usuario"
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                id="facebook"
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="seu.usuario"
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="(00) 00000-0000"
                disabled={carregando}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 