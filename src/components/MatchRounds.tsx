import React from 'react';
import { Calendar, Trophy } from 'lucide-react';

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface MatchRoundsProps {
  matches: Match[];
}

function MatchRounds({ matches }: MatchRoundsProps) {
  // Group matches into rounds of 3
  const rounds = matches.reduce((acc: Match[][], match, index) => {
    const roundIndex = Math.floor(index / 3);
    if (!acc[roundIndex]) {
      acc[roundIndex] = [];
    }
    acc[roundIndex].push(match);
    return acc;
  }, []);

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-2">
        <Trophy size={24} className="text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">Resultados por Jornada</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center gap-2">
              <Calendar size={18} />
              <h3 className="font-semibold">Jornada {roundIndex + 1}</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {round.map((match) => (
                <div key={match.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right">
                      <span className="font-medium text-gray-900">{match.homeTeam}</span>
                    </div>
                    <div className="px-3 py-1 bg-gray-50 rounded-lg font-mono">
                      <span className="font-bold text-gray-900">
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
              ))}
            </div>
          </div>
        ))}

        {rounds.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No hay partidos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchRounds;