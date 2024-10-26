import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import SportSelector from './components/SportSelector';
import CategorySelector from './components/CategorySelector';
import LeagueTable from './components/LeagueTable';

function App() {
  const [selectedSport, setSelectedSport] = useState('futbol');
  const [selectedCategory, setSelectedCategory] = useState('1-3');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Shield className="text-indigo-600" size={32} />
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
                Liga de Recreos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Colegio Madre Matilde
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 p-8 border-b border-gray-100">
            <SportSelector selectedSport={selectedSport} onSelectSport={setSelectedSport} />
            <CategorySelector selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>
          
          <div className="p-8">
            <LeagueTable sport={selectedSport} category={selectedCategory} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;