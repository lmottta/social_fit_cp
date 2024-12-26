import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, Trophy, User, Dumbbell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function BarraNavegacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const itensMenu = [
    { icone: <Home />, rotulo: "Início", caminho: "/" },
    { icone: <Activity />, rotulo: "Feed", caminho: "/feed" },
    { icone: <Dumbbell />, rotulo: "Treinos", caminho: "/treinos" },
    { icone: <Trophy />, rotulo: "Ranking", caminho: "/ranking" },
    { icone: <User />, rotulo: "Perfil", caminho: "/perfil" }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2 md:top-0 md:h-screen md:w-20 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:space-y-8 md:pt-8">
        {itensMenu.map((item) => (
          <ItemNav
            key={item.caminho}
            icone={item.icone}
            rotulo={item.rotulo}
            ativo={location.pathname === item.caminho}
            onClick={() => navigate(item.caminho)}
          />
        ))}
        
        {/* Botão de Logout */}
        <div className="md:mt-auto md:pt-4 md:border-t md:border-gray-200">
          <button
            onClick={logout}
            className="flex flex-col items-center p-2 rounded-lg transition-colors text-gray-600 hover:text-red-600"
            title="Sair"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs mt-1">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function ItemNav({ 
  icone, 
  rotulo, 
  ativo = false, 
  onClick 
}: { 
  icone: React.ReactNode; 
  rotulo: string; 
  ativo?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg transition-colors
        ${ativo ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
    >
      {icone}
      <span className="text-xs mt-1">{rotulo}</span>
    </button>
  );
}