import React from 'react';
import LeaderboardCard from '../components/LeaderboardCard';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

const rankings = {
  semanal: [
    { 
      rank: 1, 
      name: 'Ana Silva', 
      score: 2500, 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      userId: '1'
    },
    { 
      rank: 2, 
      name: 'João Santos', 
      score: 2350, 
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      userId: '2'
    },
    { 
      rank: 3, 
      name: 'Maria Costa', 
      score: 2200, 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      userId: '3'
    }
  ],
  mensal: [
    { 
      rank: 1, 
      name: 'Pedro Lima', 
      score: 9800, 
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      userId: '4'
    },
    { 
      rank: 2, 
      name: 'Carla Souza', 
      score: 9500, 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      userId: '5'
    },
    { 
      rank: 3, 
      name: 'Lucas Oliveira', 
      score: 9200, 
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      userId: '6'
    }
  ]
};

export default function Ranking() {
  const [periodo, setPeriodo] = React.useState<'semanal' | 'mensal'>('semanal');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold">Ranking</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriodo('semanal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              periodo === 'semanal' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Semanal
          </button>
          <button
            onClick={() => setPeriodo('mensal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              periodo === 'mensal' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Mensal
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {rankings[periodo].map((user) => (
          <LeaderboardCard key={user.rank} {...user} />
        ))}
      </div>
    </div>
  );
}