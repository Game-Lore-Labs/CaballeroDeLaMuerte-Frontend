// ============================================================================
// src/App.jsx - Main Application Component
// ============================================================================

import React from 'react';
import { GameProvider } from './context/GameContext';
import { GamePage } from './pages';
import './styles/theme.css';
import './styles/components.css';

function App() {
  return (
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
}

export default App;
