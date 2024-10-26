import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import AdminPanel from './AdminPanel';
import MatchRounds from './MatchRounds';
import TeamStats from './TeamStats';
import { useLocalStorage } from '../hooks/useLocalStorage';

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

export default function LeagueTable({ sport, category }: LeagueTableProps) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const { data, loading, error, saveData } = useLocalStorage(sport, category);

  const matches = data?.matches || [];
  const leagueStats = data?.stats || {};

  const calculatePoints = (won: number, drawn: number): number => {
    return (won * 3) + (drawn * 2);
  };

  const handleMatchSubmit = (match: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }) => {
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
    
    const newMatches = [newMatch, ...matches];
    const newStats = recalculateStats(newMatches);
    
    saveData({
      matches: newMatches,
      stats: newStats,
    });
  };

  const handleMatchDelete = (id: string) => {
    const newMatches = matches.filter(m => m.id !== id);
    const newStats = recalculateStats(newMatches);
    
    saveData({
      matches: newMatches,
      stats: newStats,
    });
  };

  const handleMatchUpdate = (id: string, updatedMatch: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }) => {
    const newMatches = matches.map(match => 
      match.id === id
        ? { ...match, ...updatedMatch }
        : match
    );
    const newStats = recalculateStats(newMatches);
    
    saveData({
      matches: newMatches,
      stats: newStats,
    });
  };

  const recalculateStats = (currentMatches: Match[]) => {
    const baseTeams = [
      { name: 'Blanco', color: 'bg-white border-2', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
      { name: 'Negro', color: 'bg-gray-900', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
      { name: 'Amarillo', color: 'bg-yellow-400', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
      { name: 'Verde', color: 'bg-green-500', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
      { name: 'Rojo', color: 'bg-red-600', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
      { name: 'Azul', color: 'bg-blue-600', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
    ];

    const newStats = {
      futbol: {
        '1-3': [...baseTeams],
        '4-6': [...baseTeams],
      },
      datchball: {
        '1-3': [...baseTeams],
        '4-6': [...baseTeams],
      },
    };

    currentMatches.forEach(match => {
      if (match.sport === sport && match.category === category) {
        const categoryTeams = newStats[match.sport][match.category];
        
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
      }
    });

    return newStats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  const currentTeams = leagueStats[sport]?.[category] || [];
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
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdmin(true)}
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          title="Área Admin"
        >
          <Lock size={20} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">Pos</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipo</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">PJ</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">G</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">E</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">P</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">GF</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">GC</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">DG</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedTeams.map((team, index) => {
                const points = calculatePoints(team.won, team.drawn);
                const goalDiff = team.goalsFor - team.goalsAgainst;
                
                return (
                  <tr 
                    key={team.name}
                    onClick={() => setSelectedTeam(team)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${team.color} shadow-sm border border-gray-200`}></div>
                        <span className="font-medium text-gray-900">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{team.played}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600">{team.won}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-yellow-600">{team.drawn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-red-600">{team.lost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-600">{team.goalsFor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600">{team.goalsAgainst}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <span className={goalDiff > 0 ? 'text-green-600' : goalDiff < 0 ? 'text-red-600' : 'text-gray-600'}>
                        {goalDiff > 0 ? '+' : ''}{goalDiff}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-indigo-50 font-semibold text-indigo-600">
                          {points}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <MatchRounds matches={currentMatches} />

      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          sport={sport}
          category={category}
          teams={currentTeams}
          matches={currentMatches}
          onMatchSubmit={handleMatchSubmit}
          onMatchDelete={handleMatchDelete}
          onMatchUpdate={handleMatchUpdate}
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