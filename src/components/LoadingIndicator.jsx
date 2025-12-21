// ============================================================================
// src/components/LoadingIndicator.jsx
// ============================================================================

import React from 'react';

const LoadingIndicator = ({ text = "Cargando..." }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black bg-opacity-60 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.15s'}} />
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
          </div>
          <span className="text-amber-200 text-sm font-serif">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;