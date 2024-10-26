import React, { useState } from 'react';
import { X, Check, AlertCircle, Lock, Pencil, Trash2, Save } from 'lucide-react';

interface Team {
  name: string;
  color: string;
}

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

interface AdminPanelProps {
  onClose: () => void;
  sport: string;
  category: string;
  teams: Team[];
  matches: Match[];
  onMatchSubmit: (match: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }) => void;
  onMatchDelete: (id: string) => void;
  onMatchUpdate: (id: string, match: { homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }) => void;
}

function AdminPanel({ 
  onClose, 
  sport, 
  category, 
  teams,
  matches,
  onMatchSubmit,
  onMatchDelete,
  onMatchUpdate,
}: AdminPanelProps) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'add' | 'manage'>('add');
  
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  const correctPin = '1234';

  const handlePinSubmit = () => {
    if (pin === correctPin) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('PIN incorrecto');
    }
  };

  const resetForm = () => {
    setHomeTeam('');
    setAwayTeam('');
    setHomeScore('');
    setAwayScore('');
    setEditingMatchId(null);
    setError('');
  };

  const handleMatchSubmit = () => {
    if (!homeTeam || !awayTeam || !homeScore || !awayScore) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (homeTeam === awayTeam) {
      setError('No se puede jugar contra el mismo equipo');
      return;
    }

    const matchData = {
      homeTeam,
      awayTeam,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
    };

    if (editingMatchId) {
      onMatchUpdate(editingMatchId, matchData);
    } else {
      onMatchSubmit(matchData);
    }

    resetForm();
    if (mode === 'manage') {
      setMode('add');
    }
  };

  const handleEditMatch = (match: Match) => {
    setHomeTeam(match.homeTeam);
    setAwayTeam(match.awayTeam);
    setHomeScore(match.homeScore.toString());
    setAwayScore(match.awayScore.toString());
    setEditingMatchId(match.id);
    setMode('add');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-xl">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-900">
              {isAuthenticated ? 'Administración' : 'Acceso Administrador'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN de Acceso
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="****"
                  maxLength={4}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handlePinSubmit}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Acceder
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setMode('add')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === 'add'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {editingMatchId ? 'Editando Partido' : 'Nuevo Partido'}
                </button>
                <button
                  onClick={() => setMode('manage')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    mode === 'manage'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Gestionar Partidos
                </button>
              </div>

              {mode === 'add' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equipo Local
                      </label>
                      <select
                        value={homeTeam}
                        onChange={(e) => setHomeTeam(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Seleccionar...</option>
                        {teams.map((team) => (
                          <option key={team.name} value={team.name}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goles Local
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equipo Visitante
                      </label>
                      <select
                        value={awayTeam}
                        onChange={(e) => setAwayTeam(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Seleccionar...</option>
                        {teams.map((team) => (
                          <option key={team.name} value={team.name}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goles Visitante
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {editingMatchId && (
                      <button
                        onClick={resetForm}
                        className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      onClick={handleMatchSubmit}
                      className="flex-1 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      {editingMatchId ? 'Actualizar' : 'Guardar'} Resultado
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No hay partidos registrados
                    </p>
                  ) : (
                    <div className="divide-y">
                      {matches.map((match) => (
                        <div
                          key={match.id}
                          className="py-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span className="font-medium">{match.homeTeam}</span>
                              <span className="px-3 py-1 bg-gray-100 rounded-lg font-mono">
                                {match.homeScore} - {match.awayScore}
                              </span>
                              <span className="font-medium">{match.awayTeam}</span>
                            </div>
                            <div className="text-sm text-gray-500">{match.date}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditMatch(match)}
                              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                              title="Editar partido"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => onMatchDelete(match.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar partido"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;