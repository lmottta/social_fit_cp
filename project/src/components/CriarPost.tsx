import React, { useState, useRef } from 'react';
import { Image, Lock, Globe2, PlusCircle, X, BarChart2, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OpcaoEnquete {
  texto: string;
}

interface CriarPostProps {
  onSubmit: (dados: any) => void;
}

export default function CriarPost({ onSubmit }: CriarPostProps) {
  const { usuario } = useAuth();
  const [texto, setTexto] = useState('');
  const [imagens, setImagens] = useState<string[]>([]);
  const [isPrivado, setIsPrivado] = useState(false);
  const [mostrarEnquete, setMostrarEnquete] = useState(false);
  const [opcoesEnquete, setOpcoesEnquete] = useState<OpcaoEnquete[]>([{ texto: '' }, { texto: '' }]);
  const inputImagemRef = useRef<HTMLInputElement>(null);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagens(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removerImagem = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index));
  };

  const adicionarOpcaoEnquete = () => {
    if (opcoesEnquete.length < 4) {
      setOpcoesEnquete(prev => [...prev, { texto: '' }]);
    }
  };

  const removerOpcaoEnquete = (index: number) => {
    if (opcoesEnquete.length > 2) {
      setOpcoesEnquete(prev => prev.filter((_, i) => i !== index));
    }
  };

  const atualizarOpcaoEnquete = (index: number, texto: string) => {
    setOpcoesEnquete(prev => prev.map((opcao, i) => 
      i === index ? { texto } : opcao
    ));
  };

  const handleSubmit = () => {
    if (!texto.trim() && imagens.length === 0) return;

    const post = {
      texto,
      imagens,
      isPrivado,
      enquete: mostrarEnquete ? opcoesEnquete : null,
      autorId: usuario?.id,
      criadoEm: new Date()
    };

    onSubmit(post);
    
    // Limpar formulário
    setTexto('');
    setImagens([]);
    setIsPrivado(false);
    setMostrarEnquete(false);
    setOpcoesEnquete([{ texto: '' }, { texto: '' }]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={usuario?.perfil?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nome || '')}&background=random`}
          alt={usuario?.nome}
          className="w-10 h-10 rounded-full border-2 border-emerald-100"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{usuario?.nome}</h3>
          <button
            onClick={() => setIsPrivado(!isPrivado)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
          >
            {isPrivado ? (
              <>
                <Lock className="w-4 h-4" />
                Privado
              </>
            ) : (
              <>
                <Globe2 className="w-4 h-4" />
                Público
              </>
            )}
          </button>
        </div>
      </div>

      {/* Campo de texto */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Compartilhe sua jornada fitness..."
        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none mb-4"
        rows={3}
      />

      {/* Visualização de imagens */}
      {imagens.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {imagens.map((imagem, index) => (
            <div key={index} className="relative group">
              <img
                src={imagem}
                alt={`Imagem ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => removerImagem(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enquete */}
      {mostrarEnquete && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-900">Enquete</h4>
          {opcoesEnquete.map((opcao, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={opcao.texto}
                onChange={(e) => atualizarOpcaoEnquete(index, e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-50 border border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {index >= 2 && (
                <button
                  onClick={() => removerOpcaoEnquete(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {opcoesEnquete.length < 4 && (
            <button
              onClick={adicionarOpcaoEnquete}
              className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Adicionar opção
            </button>
          )}
        </div>
      )}

      {/* Barra de ações */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={inputImagemRef}
            onChange={handleImagemChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => inputImagemRef.current?.click()}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Adicionar imagem"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMostrarEnquete(!mostrarEnquete)}
            className={`p-2 rounded-lg transition-colors ${
              mostrarEnquete 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title="Criar enquete"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!texto.trim() && imagens.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          Publicar
        </button>
      </div>
    </div>
  );
} 