import React from 'react';
import { Award, Calendar, Dumbbell, TrendingUp, User, AlertCircle, MapPin, Edit2, Instagram, Twitter, Facebook, Phone, Building2, Clock, Activity, Share2, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ContadoresSeguidores from '../components/ContadoresSeguidores';

export default function Perfil() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header com gradiente e pattern */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={usuario?.perfil?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nome || '')}&background=random`}
                alt={usuario?.nome}
                className="w-32 h-32 rounded-full border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
              />
              <Link
                to="/perfil/editar"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
              >
                <Edit2 className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{usuario?.nome}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-emerald-100 justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span>{usuario?.tipoUsuario === 'aluno' ? 'Aluno' : 'Educador Físico'}</span>
                    </div>
                    {usuario?.perfil?.cidade && usuario?.perfil?.estado && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>{usuario.perfil.cidade}, {usuario.perfil.estado}</span>
                      </div>
                    )}
                    {usuario?.perfil?.academia && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        <span>{usuario.perfil.academia}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  to="/perfil/editar"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow backdrop-blur-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 pb-12">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Dumbbell className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total de Treinos</h3>
                <p className="text-3xl font-bold text-emerald-600">{usuario?.estatisticas?.totalTreinos || '0'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Média semanal: {Math.round(parseInt(usuario?.estatisticas?.totalTreinos || '0') / 4)} treinos
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tempo Total</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.round(parseInt(usuario?.estatisticas?.minutosTotais || '0') / 60)}h
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Média por treino: {Math.round(parseInt(usuario?.estatisticas?.minutosTotais || '0') / parseInt(usuario?.estatisticas?.totalTreinos || '1'))} min
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Seguidores</h3>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">0</span>
                    <span className="text-sm text-gray-500">seguidores</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">1</span>
                    <span className="text-sm text-gray-500">seguindo</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Crescimento: +5 esta semana
              </div>
            </div>
          </div>
        </div>

        {/* Bio e Informações */}
        {(usuario?.perfil?.bio || usuario?.perfil?.modalidades?.length) && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100 mb-8">
            {usuario.perfil.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Sobre
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{usuario.perfil.bio}</p>
              </div>
            )}

            {usuario.perfil.modalidades && usuario.perfil.modalidades.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Modalidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {usuario.perfil.modalidades.map((modalidade, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium"
                    >
                      {modalidade}
                    </span>
                  ))}
                  {usuario.perfil.outraModalidade && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium">
                      {usuario.perfil.outraModalidade}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Redes Sociais */}
        {(usuario?.perfil?.instagram || usuario?.perfil?.twitter || usuario?.perfil?.facebook || usuario?.perfil?.whatsapp) && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-600" />
              Redes Sociais
            </h3>
            <div className="flex flex-wrap gap-4">
              {usuario.perfil.instagram && (
                <a
                  href={`https://instagram.com/${usuario.perfil.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="font-medium">Instagram</span>
                </a>
              )}
              {usuario.perfil.twitter && (
                <a
                  href={`https://twitter.com/${usuario.perfil.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="font-medium">Twitter</span>
                </a>
              )}
              {usuario.perfil.facebook && (
                <a
                  href={`https://facebook.com/${usuario.perfil.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="font-medium">Facebook</span>
                </a>
              )}
              {usuario.perfil.whatsapp && (
                <a
                  href={`https://wa.me/${usuario.perfil.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}