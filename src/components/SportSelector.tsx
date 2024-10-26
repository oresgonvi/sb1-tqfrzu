import React from 'react';
import { Trophy, CircleDot } from 'lucide-react';

interface SportSelectorProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
}

export default function SportSelector({ selectedSport, onSelectSport }: SportSelectorProps) {
  const sports = [
    { id: 'futbol', name: 'Fútbol', icon: Trophy },
    { id: 'datchball', name: 'Datchball', icon: CircleDot },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Deporte
      </label>
      <div className="flex gap-3">
        {sports.map((sport) => {
          const Icon = sport.icon;
          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all
                ${selectedSport === sport.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon size={18} />
              {sport.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}