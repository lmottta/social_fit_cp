import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componentes
import BarraNavegacao from './components/BarraNavegacao';
import Inicio from './pages/Inicio';
import Feed from './pages/Feed';
import Treinos from './pages/Treinos';
import Ranking from './pages/Ranking';
import Perfil from './pages/Perfil';
import PerfilPublico from './pages/PerfilPublico';
import EditarPerfil from './components/EditarPerfil';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Anamnese from './components/Anamnese';

// Componente para proteger rotas
function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {usuario && <BarraNavegacao />}
      
      <div className={usuario ? 'container mx-auto px-4 py-8' : ''}>
        <Routes>
          {/* Rotas públicas */}
          <Route
            path="/login"
            element={usuario ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/cadastro"
            element={usuario ? <Navigate to="/" replace /> : <Cadastro />}
          />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Inicio />
              </RotaProtegida>
            }
          />
          <Route
            path="/feed"
            element={
              <RotaProtegida>
                <Feed />
              </RotaProtegida>
            }
          />
          <Route
            path="/treinos"
            element={
              <RotaProtegida>
                <Treinos />
              </RotaProtegida>
            }
          />
          <Route
            path="/ranking"
            element={
              <RotaProtegida>
                <Ranking />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RotaProtegida>
                <Perfil />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil/:id"
            element={
              <RotaProtegida>
                <PerfilPublico />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil/editar"
            element={
              <RotaProtegida>
                <EditarPerfil />
              </RotaProtegida>
            }
          />
          <Route
            path="/anamnese"
            element={
              <RotaProtegida>
                <Anamnese />
              </RotaProtegida>
            }
          />

          {/* Redireciona rotas não encontradas para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App; 