// src/components/CharacterCreation.jsx
// ============================================================================

import React, { useState } from 'react';
import { Sword, Wand2, UserCheck, Cross, Shield } from 'lucide-react';
import ChoiceButton from './ChoiceButton';

const CharacterCreation = ({ onCreateCharacter, loading, error }) => {
  const [charName, setCharName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Fighter');

  const classes = [
    { name: 'Fighter', icon: Sword, desc: 'Guerrero experto en combate cuerpo a cuerpo' },
    { name: 'Wizard', icon: Wand2, desc: 'Mago con poderosos conjuros arcanos' },
    { name: 'Rogue', icon: UserCheck, desc: 'Pícaro astuto con habilidades furtivas' },
    { name: 'Cleric', icon: Cross, desc: 'Clérigo con poderes curativos divinos' },
    { name: 'Paladin', icon: Shield, desc: 'Paladín que combina fe y espada' },
  ];

  const handleSubmit = () => {
    if (charName.trim()) {
      onCreateCharacter(charName, selectedClass);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg shadow-2xl p-8 border border-purple-500">
        <div className="text-center mb-8">
          <Sword className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">
            El Escudero del Caballero de la Muerte
          </h1>
          <p className="text-gray-300">Una aventura de libro-juego interactivo</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-semibold">
              Nombre del Personaje
            </label>
            <input
              type="text"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              placeholder="Ingresa el nombre de tu héroe..."
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white mb-3 font-semibold">
              Clase del Personaje
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classes.map((cls) => {
                const Icon = cls.icon;
                return (
                  <button
                    key={cls.name}
                    onClick={() => setSelectedClass(cls.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedClass === cls.name
                        ? 'bg-purple-600 border-purple-400 shadow-lg'
                        : 'bg-slate-700 border-slate-600 hover:border-purple-500'
                    }`}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-purple-300" />
                      <div className="text-left flex-1">
                        <p className="text-white font-bold">{cls.name}</p>
                        <p className="text-gray-300 text-xs">{cls.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!charName.trim() || loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Creando...' : 'Comenzar Aventura'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;