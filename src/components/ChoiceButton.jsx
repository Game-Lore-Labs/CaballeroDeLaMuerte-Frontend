// ============================================================================
// src/components/ChoiceButton.jsx
// ============================================================================

import React from 'react';

const ChoiceButton = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: 'linear-gradient(135deg, #d4a574 0%, #c69963 50%, #a67c52 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Textura de fondo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Borde interior */}
      <div className="absolute inset-0 border-4 border-amber-900 opacity-40 pointer-events-none" />
      
      {/* Efecto hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" />

      {/* Texto */}
      <div className="relative py-5 px-8">
        <p className="text-xl md:text-2xl font-bold text-amber-950 drop-shadow-sm font-serif tracking-wide group-hover:scale-105 transition-transform duration-300">
          {text}
        </p>
      </div>

      {/* Esquinas decorativas */}
      <div className="absolute top-1 left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 opacity-60" />
      <div className="absolute top-1 right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 opacity-60" />
      <div className="absolute bottom-1 left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 opacity-60" />
      <div className="absolute bottom-1 right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 opacity-60" />
    </button>
  );
};

export default ChoiceButton;