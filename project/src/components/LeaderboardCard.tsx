import React from 'react';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeaderboardCardProps {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  userId: string;
}

export default function LeaderboardCard({ rank, name, score, avatar, userId }: LeaderboardCardProps) {
  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm mb-2">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4
        ${rank === 1 ? 'bg-yellow-100 text-yellow-600' :
          rank === 2 ? 'bg-gray-100 text-gray-600' :
          rank === 3 ? 'bg-orange-100 text-orange-600' :
          'bg-blue-50 text-blue-600'}`}>
        {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
      </div>
      
      <Link to={`/perfil/${userId}`} className="flex items-center flex-1 hover:opacity-80">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        
        <div className="ml-4">
          <h3 className="font-semibold hover:text-blue-600 transition-colors">{name}</h3>
          <p className="text-sm text-gray-500">{score} points</p>
        </div>
      </Link>
    </div>
  );
}