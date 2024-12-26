import React from 'react';
import { Home, Activity, Trophy, User, Dumbbell } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2 md:top-0 md:h-screen md:w-20 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:h-full md:justify-start md:space-y-8 md:pt-8">
        <NavItem icon={<Home />} label="Home" active />
        <NavItem icon={<Activity />} label="Feed" />
        <NavItem icon={<Dumbbell />} label="Workouts" />
        <NavItem icon={<Trophy />} label="Leaderboard" />
        <NavItem icon={<User />} label="Profile" />
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center p-2 rounded-lg transition-colors
      ${active ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}