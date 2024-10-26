import React from 'react';
import { Trophy, Target, Percent } from 'lucide-react';

interface TeamStatsProps {
  team: {
    name: string;
    color: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  onClose: () => void;
}

function TeamStats({ team, onClose }: TeamStatsProps) {
  const winRate = team.played > 0 ? ((team.won / team.played) * 100).toFixed(1) : '0';
  const avgGoalsScored = team.played > 0 ? (team.goalsFor / team.played).toFixed(1) : '0';
  const avgGoalsConceded = team.played > 0 ? (team.goalsAgainst / team.played).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${team.color} shadow-sm`}></div>
            <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-yellow-500" size={20} />
                <span className="font-semibold text-gray-700">Victorias</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{winRate}%</p>
              <p className="text-sm text-gray-500">Porcentaje de victorias</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-blue-500" size={20} />
                <span className="font-semibold text-gray-700">Promedio</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{avgGoalsScored}</p>
              <p className="text-sm text-gray-500">Goles por partido</p>
            </div>

            <div className="col-span-2 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="text-purple-500" size={20} />
                <span className="font-semibold text-gray-700">Estadísticas</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Partidos jugados</span>
                  <span className="font-semibold text-gray-800">{team.played}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Victorias</span>
                  <span className="font-semibold text-green-600">{team.won}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Empates</span>
                  <span className="font-semibold text-yellow-600">{team.drawn}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Derrotas</span>
                  <span className="font-semibold text-red-600">{team.lost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamStats;