// ============================================================================
// src/pages/GamePage.jsx - Main Game Page
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { MainLayout } from '../components/layout';
import { NotificationContainer } from '../components/ui';
import { AdventurePanel, CombatModal } from '../components/game';
import { CharacterSheet, Inventory, CluesPanel, HistoryPanel } from '../components/character';
import './GamePage.css';

// Loading screen component
const LoadingScreen = ({ onStart }) => {
  return (
    <div className="loading-screen">
      <div className="loading-screen__bg" />
      <div className="loading-screen__content">
        <div className="loading-screen__logo">
          <span className="logo-icon">⚔️</span>
          <h1 className="logo-title">El Escudero del Caballero de la Muerte</h1>
          <p className="logo-subtitle">Una aventura interactiva</p>
        </div>
        
        <div className="loading-screen__ornament">
          <span>✦</span>
          <div className="ornament-line" />
          <span>✦</span>
        </div>
        
        <button className="start-button" onClick={onStart}>
          <span className="start-button__text">Comenzar Aventura</span>
          <span className="start-button__icon">→</span>
        </button>
        
        <p className="loading-screen__hint">
          Basado en las reglas de D&D 5ª Edición
        </p>
      </div>
    </div>
  );
};

// Error display component
const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="error-display">
      <div className="error-display__icon">⚠️</div>
      <h2 className="error-display__title">Error</h2>
      <p className="error-display__message">{error}</p>
      <button className="error-display__button" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
};

// Main GamePage component
const GamePage = () => {
  const [activeTab, setActiveTab] = useState('adventure');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  const {
    isLoaded,
    isLoading,
    error,
    narrative,
    options,
    character,
    characterSheet,
    history,
    currentEntry,
    inCombat,
    combatState,
    lastResult,
    notifications,
    loadGame,
    saveGame,
    resetGame,
    selectOption,
    attack,
    processEnemyTurn,
    finishCombat,
    removeNotification,
  } = useGame();

  // Handle game load
  const handleStartGame = async () => {
    try {
      await loadGame();
    } catch (err) {
    }
  };

  // Handle save game
  const handleSaveGame = async () => {
    setSaving(true);
    try {
      await saveGame();
    } finally {
      setSaving(false);
    }
  };

  // Handle reset game (with confirmation for navbar button)
  const handleResetGame = async () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el juego? Se perderá todo el progreso.')) {
      await doResetGame();
    }
  };

  // Actual reset game logic (no confirmation needed for game over)
  const doResetGame = async () => {
    setResetting(true);
    try {
      await resetGame();
      setActiveTab('adventure');
    } finally {
      setResetting(false);
    }
  };

  // Handle option selection
  const handleSelectOption = async (optionId) => {
    try {
      const result = await selectOption(optionId);
      
      // If combat started, switch to combat view automatically
      if (result.type === 'combat_started') {
        setActiveTab('adventure'); // Stay on adventure but show combat
      }
    } catch (err) {
    }
  };

  // Handle combat attack
  const handleAttack = async (targetIndex, weaponIndex = 0) => {
    try {
      const result = await attack(targetIndex, weaponIndex);
      // El turno enemigo ahora se maneja dentro del CombatModal
      return result;
    } catch (err) {
      throw err;
    }
  };

  // Handle enemy turn (called from CombatModal)
  const handleEnemyTurn = async () => {
    try {
      const result = await processEnemyTurn();
      return result;
    } catch (err) {
      throw err;
    }
  };

  // Handle end combat
  const handleEndCombat = async () => {
    try {
      await finishCombat();
    } catch (err) {
    }
  };

  // Render tab content
  const renderTabContent = () => {
    // Combat is now handled by modal overlay, so we always render normal content
    switch (activeTab) {
      case 'adventure':
        return (
          <AdventurePanel
            narrative={narrative}
            options={options}
            character={character}
            onSelectOption={handleSelectOption}
            loading={isLoading}
            lastResult={lastResult}
            onResetGame={doResetGame}
          />
        );
      
      case 'character':
        return <CharacterSheet characterSheet={characterSheet} character={character} />;
      
      case 'inventory':
        return (
          <Inventory 
            inventory={character?.inventory || []} 
            equipment={character?.equipment || []}
          />
        );
      
      case 'clues':
        return <CluesPanel clues={character?.clues || []} />;
      
      case 'history':
        return (
          <HistoryPanel 
            history={history} 
            currentEntry={currentEntry}
          />
        );
      
      default:
        return null;
    }
  };

  // Show loading screen if not loaded
  if (!isLoaded && !error) {
    return (
      <>
        <LoadingScreen onStart={handleStartGame} />
        <NotificationContainer 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
      </>
    );
  }

  // Show error if present
  if (error && !isLoaded) {
    return (
      <>
        <ErrorDisplay error={error} onRetry={handleStartGame} />
        <NotificationContainer 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
      </>
    );
  }

  return (
    <>
      <MainLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        character={character}
        onSave={handleSaveGame}
        onLoad={handleStartGame}
        onReset={handleResetGame}
        saving={saving}
        resetting={resetting}
      >
        {renderTabContent()}
      </MainLayout>
      
      {/* Combat Modal - Arena de Combate */}
      <CombatModal
        isOpen={inCombat}
        combatState={combatState}
        onAttack={handleAttack}
        onEnemyTurn={handleEnemyTurn}
        onEndCombat={handleEndCombat}
        loading={isLoading}
      />
      
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </>
  );
};

export default GamePage;
