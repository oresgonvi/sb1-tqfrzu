import { useState, useEffect } from 'react';

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

interface LeagueData {
  matches: Match[];
  stats: {
    [sport: string]: {
      [category: string]: TeamStats[];
    };
  };
}

const baseTeams = [
  { name: 'Blanco', color: 'bg-white border-2', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Negro', color: 'bg-gray-900', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Amarillo', color: 'bg-yellow-400', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Verde', color: 'bg-green-500', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Rojo', color: 'bg-red-600', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
  { name: 'Azul', color: 'bg-blue-600', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 },
];

const initialData: LeagueData = {
  matches: [],
  stats: {
    futbol: {
      '1-3': [...baseTeams],
      '4-6': [...baseTeams],
    },
    datchball: {
      '1-3': [...baseTeams],
      '4-6': [...baseTeams],
    },
  },
};

export function useLocalStorage(sport: string, category: string) {
  const [data, setData] = useState<LeagueData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('leagueData');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading data from localStorage');
      setLoading(false);
    }
  }, []);

  const saveData = (newData: LeagueData) => {
    try {
      localStorage.setItem('leagueData', JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      setError('Error saving data to localStorage');
    }
  };

  return {
    data,
    loading,
    error,
    saveData,
  };
}