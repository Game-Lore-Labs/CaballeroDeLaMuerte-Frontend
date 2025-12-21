// ============================================================================
// src/components/MuteButton.jsx
// ============================================================================

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MuteButton = ({ isMuted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-6 right-6 z-50 bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full transition-all backdrop-blur-sm border border-amber-700"
      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-amber-300" />
      ) : (
        <Volume2 className="w-6 h-6 text-amber-300" />
      )}
    </button>
  );
};

export default MuteButton;