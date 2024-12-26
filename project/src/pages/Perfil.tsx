import React from 'react';
import { Award, Calendar, Dumbbell, TrendingUp, User, AlertCircle, MapPin, Edit2, Instagram, Twitter, Facebook, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ContadoresSeguidores from '../components/ContadoresSeguidores';

export default function Perfil() {
  const { usuario } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Cabeçalho do perfil */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <img
              src={usuario?.perfil?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nome || '')}&background=random`}
              alt={usuario?.nome}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{usuario?.nome}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">{usuario?.tipoUsuario === 'aluno' ? 'Aluno' : 'Educador Físico'}</span>
              </div>
              {usuario?.perfil?.cidade && usuario?.perfil?.estado && (
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{usuario.perfil.cidade}, {usuario.perfil.estado}</span>
                </div>
              )}
              {usuario && (
                <div className="mt-3">
                  <ContadoresSeguidores usuarioId={usuario.id} />
                </div>
              )}
            </div>
          </div>
          <Link
            to="/perfil/editar"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar</span>
          </Link>
        </div>

        {usuario?.perfil?.bio && (
          <p className="text-gray-600 mt-4">{usuario.perfil.bio}</p>
        )}

        {/* Academia e Modalidades */}
        {(usuario?.perfil?.academia || (usuario?.perfil?.modalidades && usuario.perfil.modalidades.length > 0)) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {usuario.perfil.academia && (
              <div className="text-gray-600 mb-2">
                <strong>Academia/Grupo:</strong> {usuario.perfil.academia}
              </div>
            )}
            {usuario.perfil.modalidades && usuario.perfil.modalidades.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {usuario.perfil.modalidades.map(modalidade => (
                  <span
                    key={modalidade}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {modalidade}
                  </span>
                ))}
                {usuario.perfil.modalidades.includes('Outro') && usuario.perfil.outraModalidade && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {usuario.perfil.outraModalidade}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Redes Sociais */}
        {(usuario?.perfil?.instagram || usuario?.perfil?.twitter || usuario?.perfil?.facebook || usuario?.perfil?.whatsapp) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            {usuario.perfil.instagram && (
              <a
                href={`https://instagram.com/${usuario.perfil.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {usuario.perfil.twitter && (
              <a
                href={`https://twitter.com/${usuario.perfil.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {usuario.perfil.facebook && (
              <a
                href={`https://facebook.com/${usuario.perfil.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {usuario.perfil.whatsapp && (
              <a
                href={`https://wa.me/${usuario.perfil.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>
        )}

        {/* Alerta de Anamnese pendente para alunos */}
        {usuario?.tipoUsuario === 'aluno' && !usuario?.anamneseCompleta && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Avaliação Física Pendente</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Complete sua avaliação física para recebermos treinos mais personalizados para você.
                </p>
                <Link
                  to="/anamnese"
                  className="inline-block mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                >
                  Preencher agora
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <Dumbbell className="w-5 h-5 text-blue-500" />
            <span className="ml-2 text-gray-600 text-sm">Total de Treinos</span>
          </div>
          <div className="text-2xl font-bold">{usuario?.estatisticas?.totalTreinos || '0'}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="ml-2 text-gray-600 text-sm">Minutos Totais</span>
          </div>
          <div className="text-2xl font-bold">{usuario?.estatisticas?.minutosTotais || '0'}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="ml-2 text-gray-600 text-sm">Sequência Atual</span>
          </div>
          <div className="text-2xl font-bold">7</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <User className="w-5 h-5 text-purple-500" />
            <span className="ml-2 text-gray-600 text-sm">Ranking Mensal</span>
          </div>
          <div className="text-2xl font-bold">#42</div>
        </div>
      </div>
    </div>
  );
}