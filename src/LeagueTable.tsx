import React, { useState } from 'react';
import { Lock, History } from 'lucide-react';
import AdminPanel from './AdminPanel';
import MatchHistory from './MatchHistory';
import TeamStats from './TeamStats';

interface TeamStats {
  name: string;
  color: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  category: string;
}

interface LeagueTableProps {
  sport: string;
  category: string;
}

const baseTeams = [
  { name: 'Blanco', color: 'bg-white border-2', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Negro', color: 'bg-gray-900', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Amarillo', color: 'bg-yellow-400', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Verde', color: 'bg-green-500', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Rojo', color: 'bg-red-600', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Azul', color: 'bg-blue-600', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
];

function LeagueTable({ sport, category }: LeagueTableProps) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagueStats, setLeagueStats] = useState<Record<string, Record<string, TeamStats[]>>>({
    futbol: {
      '1-3': [...baseTeams],
      '4-6': [...baseTeams],
    },
    datchball: {
      '1-3': [...baseTeams],
      '4-6': [...baseTeams],
    },
  });

  const calculatePoints = (won: number, drawn: number): number => {
    return (won * 3) + (drawn * 2);
  };

  const handleMatchSubmit = (match: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }) => {
    // Add match to history with sport and category
    const newMatch: Match = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...match,
      sport,
      category,
    };
    setMatches(prev => [newMatch, ...prev]);

    // Update team stats for the specific sport and category
    setLeagueStats(currentStats => {
      const newStats = { ...currentStats };
      const categoryTeams = [...newStats[sport][category]];
      
      // Update home team stats
      const homeTeamIndex = categoryTeams.findIndex(team => team.name === match.homeTeam);
      if (homeTeamIndex !== -1) {
        categoryTeams[homeTeamIndex] = {
          ...categoryTeams[homeTeamIndex],
          played: categoryTeams[homeTeamIndex].played + 1,
          won: categoryTeams[homeTeamIndex].won + (match.homeScore > match.awayScore ? 1 : 0),
          drawn: categoryTeams[homeTeamIndex].drawn + (match.homeScore === match.awayScore ? 1 : 0),
          lost: categoryTeams[homeTeamIndex].lost + (match.homeScore < match.awayScore ? 1 : 0),
          goalsFor: categoryTeams[homeTeamIndex].goalsFor + match.homeScore,
          goalsAgainst: categoryTeams[homeTeamIndex].goalsAgainst + match.awayScore,
        };
      }

      // Update away team stats
      const awayTeamIndex = categoryTeams.findIndex(team => team.name === match.awayTeam);
      if (awayTeamIndex !== -1) {
        categoryTeams[awayTeamIndex] = {
          ...categoryTeams[awayTeamIndex],
          played: categoryTeams[awayTeamIndex].played + 1,
          won: categoryTeams[awayTeamIndex].won + (match.awayScore > match.homeScore ? 1 : 0),
          drawn: categoryTeams[awayTeamIndex].drawn + (match.awayScore === match.homeScore ? 1 : 0),
          lost: categoryTeams[awayTeamIndex].lost + (match.awayScore < match.homeScore ? 1 : 0),
          goalsFor: categoryTeams[awayTeamIndex].goalsFor + match.awayScore,
          goalsAgainst: categoryTeams[awayTeamIndex].goalsAgainst + match.homeScore,
        };
      }

      newStats[sport][category] = categoryTeams;
      return newStats;
    });
  };

  const currentTeams = leagueStats[sport][category];
  const currentMatches = matches.filter(m => m.sport === sport && m.category === category);

  const sortedTeams = [...currentTeams].sort((a, b) => {
    const pointsA = calculatePoints(a.won, a.drawn);
    const pointsB = calculatePoints(b.won, b.drawn);
    if (pointsB !== pointsA) return pointsB - pointsA;
    const goalDiffA = a.goalsFor - a.goalsAgainst;
    const goalDiffB = b.goalsFor - b.goalsAgainst;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowAdmin(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Lock size={18} />
          Área Admin
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 overflow-x-auto rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Pos</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Equipo</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">PJ</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">G</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">E</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">P</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">GF</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">GC</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">DG</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedTeams.map((team, index) => {
                const points = calculatePoints(team.won, team.drawn);
                const goalDiff = team.goalsFor - team.goalsAgainst;
                return (
                  <tr 
                    key={team.name} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${team.color} shadow-sm`}></div>
                        <span className="text-lg font-semibold text-gray-900">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">{team.played}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-medium">{team.won}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-yellow-600 font-medium">{team.drawn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-red-600 font-medium">{team.lost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-blue-600 font-medium">{team.goalsFor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-orange-600 font-medium">{team.goalsAgainst}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                      <span className={`${goalDiff > 0 ? 'text-green-600' : goalDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {goalDiff > 0 ? '+' : ''}{goalDiff}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                        {points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:col-span-1">
          <MatchHistory matches={currentMatches} />
        </div>
      </div>

      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          sport={sport}
          category={category}
          teams={currentTeams}
          onMatchSubmit={handleMatchSubmit}
        />
      )}

      {selectedTeam && (
        <TeamStats 
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}

export default LeagueTable;