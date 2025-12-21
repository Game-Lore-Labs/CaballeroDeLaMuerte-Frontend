// ============================================================================
// src/components/CharacterSheet.jsx
// ============================================================================

import React from 'react';
import { Heart, Award, Package, Scroll } from 'lucide-react';

const CharacterSheet = ({ character, isOpen, onToggle }) => {
  if (!character) return null;

  const hpPercentage = (character.charHP / character.charMaxHP) * 100;
  const hpColor = hpPercentage > 60 ? 'bg-green-500' : hpPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <>
      {/* Botón para abrir/cerrar */}
      <button
        onClick={onToggle}
        className="absolute top-6 left-6 z-50 bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full transition-all backdrop-blur-sm border border-amber-700"
        aria-label="Ver hoja de personaje"
      >
        <Scroll className="w-6 h-6 text-amber-300" />
      </button>

      {/* Panel deslizable */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-black bg-opacity-90 backdrop-blur-md border-r-2 border-amber-700 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-4 overflow-y-auto h-full">
          {/* Header */}
          <div className="border-b-2 border-amber-700 pb-4">
            <h2 className="text-2xl font-bold text-amber-100 font-serif">{character.charName}</h2>
            <p className="text-amber-300 text-sm">{character.charClass}</p>
          </div>

          {/* HP */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-amber-100 font-semibold">Puntos de Vida</span>
            </div>
            <div className="bg-gray-800 rounded-full h-6 overflow-hidden">
              <div
                className={`${hpColor} h-full transition-all duration-300 flex items-center justify-center text-xs font-bold text-white`}
                style={{ width: `${hpPercentage}%` }}
              >
                {character.charHP}/{character.charMaxHP}
              </div>
            </div>
          </div>

          {/* XP */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-amber-100 font-semibold">Experiencia</span>
            </div>
            <p className="text-amber-300 text-lg">{character.charXP} XP</p>
          </div>

          {/* Inventario */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span className="text-amber-100 font-semibold">Inventario</span>
            </div>
            <div className="space-y-1">
              {character.charInventory.map((item, idx) => (
                <div key={idx} className="bg-gray-800 rounded p-2 text-sm">
                  <p className="text-amber-200 font-medium">{item.itemName}</p>
                  <p className="text-gray-400 text-xs">{item.itemType}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pistas */}
          {character.charClues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-purple-400" />
                <span className="text-amber-100 font-semibold">Pistas</span>
              </div>
              <div className="space-y-1">
                {character.charClues.map((clue, idx) => (
                  <div key={idx} className="bg-purple-900 bg-opacity-30 rounded p-2 border border-purple-700">
                    <p className="text-purple-200 text-sm italic">"{clue.replace('Clue ', '')}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CharacterSheet;