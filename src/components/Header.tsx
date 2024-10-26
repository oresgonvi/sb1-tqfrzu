import React from 'react';
import { Trophy } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">
            Ligas de Recreos
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;