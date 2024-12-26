import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarAnamnese } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export default function Anamnese() {
  const navigate = useNavigate();
  const { usuario, login } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    idade: usuario?.anamnese?.idade || '',
    altura: usuario?.anamnese?.altura || '',
    peso: usuario?.anamnese?.peso || '',
    objetivos: usuario?.anamnese?.objetivos || '',
    restricoes: usuario?.anamnese?.restricoes || '',
    experiencia: usuario?.anamnese?.experiencia || 'iniciante',
    frequencia: usuario?.anamnese?.frequencia || '1-2',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      if (usuario?.id) {
        const usuarioAtualizado = await atualizarAnamnese(usuario.id, formData);
        // Atualiza o estado do usuário com os novos dados
        login('token-atualizado', usuarioAtualizado);
        navigate('/perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar anamnese:', error);
      setErro('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSkip = () => {
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Avaliação Física</h2>
          <p className="mt-2 text-gray-600">
            Estas informações nos ajudarão a personalizar sua experiência
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {erro && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-700">
                  Idade
                </label>
                <input
                  id="idade"
                  type="number"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Anos"
                  disabled={carregando}
                />
              </div>
              <div>
                <label htmlFor="altura" className="block text-sm font-medium text-gray-700">
                  Altura
                </label>
                <input
                  id="altura"
                  type="number"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="cm"
                  disabled={carregando}
                />
              </div>
            </div>

            <div>
              <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
                Peso
              </label>
              <input
                id="peso"
                type="number"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="kg"
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700">
                Objetivos
              </label>
              <textarea
                id="objetivos"
                value={formData.objetivos}
                onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Seus objetivos com os exercícios"
                rows={3}
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="restricoes" className="block text-sm font-medium text-gray-700">
                Restrições Médicas
              </label>
              <textarea
                id="restricoes"
                value={formData.restricoes}
                onChange={(e) => setFormData({ ...formData, restricoes: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Lesões, condições médicas, etc."
                rows={3}
                disabled={carregando}
              />
            </div>

            <div>
              <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700">
                Experiência com Exercícios
              </label>
              <select
                id="experiencia"
                value={formData.experiencia}
                onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                disabled={carregando}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            <div>
              <label htmlFor="frequencia" className="block text-sm font-medium text-gray-700">
                Frequência Semanal Desejada
              </label>
              <select
                id="frequencia"
                value={formData.frequencia}
                onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                disabled={carregando}
              >
                <option value="1-2">1-2 vezes por semana</option>
                <option value="3-4">3-4 vezes por semana</option>
                <option value="5+">5 ou mais vezes por semana</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              disabled={carregando}
            >
              Pular por enquanto
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