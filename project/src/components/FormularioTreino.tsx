import React, { useState } from 'react';
import { Plus, X, Save, Dumbbell, ListChecks } from 'lucide-react';
import type { TipoTreino } from '../types';

interface FormularioTreinoProps {
  onSubmit: (dados: DadosTreino) => void;
  treinoInicial?: DadosTreino;
}

export interface DadosTreino {
  nome: string;
  tipo: TipoTreino;
  tipoPersonalizado?: string;
  duracao: number;
  nivel: string;
  descricao: string;
  intensidade: 'baixa' | 'media' | 'alta';
  objetivo: string;
  exercicios: Array<{
    nome: string;
    series: number;
    repeticoes: number;
    peso?: number;
    descanso: number;
    observacoes?: string;
  }>;
}

export default function FormularioTreino({ onSubmit, treinoInicial }: FormularioTreinoProps) {
  const [dados, setDados] = useState<DadosTreino>(treinoInicial || {
    nome: '',
    tipo: 'forca',
    tipoPersonalizado: '',
    duracao: 60,
    nivel: 'iniciante',
    descricao: '',
    intensidade: 'media',
    objetivo: '',
    exercicios: []
  });

  const adicionarExercicio = () => {
    setDados({
      ...dados,
      exercicios: [...dados.exercicios, { 
        nome: '', 
        series: 3, 
        repeticoes: 12,
        descanso: 60,
        observacoes: ''
      }]
    });
  };

  const removerExercicio = (index: number) => {
    setDados({
      ...dados,
      exercicios: dados.exercicios.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(dados);
    }} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Dumbbell className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Informações do Treino</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Treino</label>
            <input
              type="text"
              value={dados.nome}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              placeholder="Ex: Treino Full Body A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={dados.tipo}
              onChange={(e) => setDados({ ...dados, tipo: e.target.value as TipoTreino })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              required
            >
              <option value="forca">Força</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="yoga">Yoga</option>
              <option value="funcional">Funcional</option>
              <option value="pilates">Pilates</option>
              <option value="crossfit">CrossFit</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {dados.tipo === 'outro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo Personalizado</label>
              <input
                type="text"
                value={dados.tipoPersonalizado}
                onChange={(e) => setDados({ ...dados, tipoPersonalizado: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                placeholder="Ex: Natação, Dança, etc."
                required={dados.tipo === 'outro'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
            <input
              type="number"
              value={dados.duracao}
              onChange={(e) => setDados({ ...dados, duracao: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nível</label>
            <select
              value={dados.nivel}
              onChange={(e) => setDados({ ...dados, nivel: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              required
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Intensidade</label>
            <select
              value={dados.intensidade}
              onChange={(e) => setDados({ ...dados, intensidade: e.target.value as 'baixa' | 'media' | 'alta' })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              required
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Objetivo</label>
            <input
              type="text"
              value={dados.objetivo}
              onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
              placeholder="Ex: Hipertrofia, Resistência, etc."
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={dados.descricao}
            onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
            rows={3}
            placeholder="Descreva os objetivos e observações gerais do treino"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <ListChecks className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Exercícios</h3>
          </div>
          <button
            type="button"
            onClick={adicionarExercicio}
            className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Exercício
          </button>
        </div>

        <div className="space-y-4">
          {dados.exercicios.map((exercicio, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-2 py-1 rounded">
                  Exercício {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removerExercicio(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Exercício</label>
                  <input
                    placeholder="Ex: Supino Reto"
                    value={exercicio.nome}
                    onChange={(e) => {
                      const novosExercicios = [...dados.exercicios];
                      novosExercicios[index] = { ...exercicio, nome: e.target.value };
                      setDados({ ...dados, exercicios: novosExercicios });
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Séries</label>
                    <input
                      type="number"
                      value={exercicio.series}
                      onChange={(e) => {
                        const novosExercicios = [...dados.exercicios];
                        novosExercicios[index] = { ...exercicio, series: Number(e.target.value) };
                        setDados({ ...dados, exercicios: novosExercicios });
                      }}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reps</label>
                    <input
                      type="number"
                      value={exercicio.repeticoes}
                      onChange={(e) => {
                        const novosExercicios = [...dados.exercicios];
                        novosExercicios[index] = { ...exercicio, repeticoes: Number(e.target.value) };
                        setDados({ ...dados, exercicios: novosExercicios });
                      }}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                    <input
                      type="number"
                      value={exercicio.peso || ''}
                      onChange={(e) => {
                        const novosExercicios = [...dados.exercicios];
                        novosExercicios[index] = { ...exercicio, peso: Number(e.target.value) };
                        setDados({ ...dados, exercicios: novosExercicios });
                      }}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descanso (segundos)</label>
                  <input
                    type="number"
                    value={exercicio.descanso}
                    onChange={(e) => {
                      const novosExercicios = [...dados.exercicios];
                      novosExercicios[index] = { ...exercicio, descanso: Number(e.target.value) };
                      setDados({ ...dados, exercicios: novosExercicios });
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    min="0"
                    step="5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Observações</label>
                  <input
                    type="text"
                    value={exercicio.observacoes || ''}
                    onChange={(e) => {
                      const novosExercicios = [...dados.exercicios];
                      novosExercicios[index] = { ...exercicio, observacoes: e.target.value };
                      setDados({ ...dados, exercicios: novosExercicios });
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Ex: Fazer com pegada fechada"
                  />
                </div>
              </div>
            </div>
          ))}

          {dados.exercicios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum exercício adicionado. Clique no botão acima para começar.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Salvar Treino
        </button>
      </div>
    </form>
  );
}