import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

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

export const useFirebase = (sport: string, category: string) => {
  const [data, setData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataRef = ref(db, 'leagueData');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        const value = snapshot.val();
        setData(value || { matches: [], stats: {} });
        setLoading(false);
      } catch (err) {
        setError('Error loading data');
        setLoading(false);
      }
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveData = async (newData: LeagueData) => {
    try {
      await set(ref(db, 'leagueData'), newData);
    } catch (err) {
      setError('Error saving data');
    }
  };

  return {
    data,
    loading,
    error,
    saveData,
  };
};