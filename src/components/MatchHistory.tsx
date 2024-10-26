import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface MatchHistoryProps {
  matches: Match[];
  onDeleteMatch: (id: string) => void;
}

function MatchHistory({ matches, onDeleteMatch }: MatchHistoryProps) {
  return (
    <div className="border rounded-lg">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Calendar size={18} className="text-blue-600" />
        <h3 className="font-medium text-gray-900">Últimos Partidos</h3>
      </div>
      
      <div className="divide-y">
        {matches.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No hay partidos registrados
          </p>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="p-4 hover:bg-gray-50 transition-colors relative group"
            >
              <button
                onClick={() => onDeleteMatch(match.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                title="Eliminar partido"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-right">
                  <span className="font-medium text-gray-900">{match.homeTeam}</span>
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded">
                  <span className="font-semibold text-gray-900">
                    {match.homeScore} - {match.awayScore}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{match.awayTeam}</span>
                </div>
              </div>
              
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">{match.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MatchHistory;