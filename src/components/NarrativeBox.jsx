// ============================================================================
// src/components/NarrativeBox.jsx
// ============================================================================

import React from 'react';

const NarrativeBox = ({ title, description }) => {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <h1 className="text-5xl md:text-6xl font-bold text-center text-amber-100 drop-shadow-2xl tracking-wider font-serif">
        {title}
      </h1>

      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-8 border-2 border-amber-700 shadow-2xl">
        <p className="text-lg md:text-xl leading-relaxed text-gray-100 whitespace-pre-line font-serif">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NarrativeBox;