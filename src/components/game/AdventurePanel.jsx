// ============================================================================
// src/components/game/AdventurePanel.jsx - Main Adventure Panel
// ============================================================================

import React, { useState } from 'react';
import { Panel, StatBar } from '../ui';
import { useGame } from '../../context/GameContext';
import { ATTRIBUTE_NAMES_ES, SKILL_NAMES_ES } from '../../utils/constants';
import './AdventurePanel.css';

// Helper to translate attribute/skill names
const translateName = (name) => {
  if (!name) return '';
  return ATTRIBUTE_NAMES_ES[name] || SKILL_NAMES_ES[name] || name;
};

// Option button component
const OptionButton = ({ option, onClick, disabled, loading }) => {
  return (
    <button
      className="option-button"
      onClick={() => onClick(option.id)}
      disabled={disabled}
    >
      <span className="option-button__number">{option.id}</span>
      <span className="option-button__text">{option.description}</span>
      <span className="option-button__arrow">→</span>
      <span className="option-button__shine" />
    </button>
  );
};

// Result display component
const ResultDisplay = ({ result, onDismiss }) => {
  if (!result) return null;
  
  // No mostrar overlay para combate - el CombatModal se encarga de eso
  if (result.type === 'combat_started') return null;
  
  // No mostrar para navegación simple
  if (result.type === 'navigated') return null;

  const getResultInfo = (type) => {
    switch (type) {
      case 'check_passed':
        return { icon: '✓', title: '¡Éxito!', color: 'success' };
      case 'check_failed':
        return { icon: '✗', title: 'Fallaste', color: 'error' };
      case 'save_passed':
        return { icon: '🛡️', title: '¡Salvación!', color: 'success' };
      case 'save_failed':
        return { icon: '💥', title: 'No resististe', color: 'error' };
      default:
        return null; // No mostrar para tipos desconocidos
    }
  };

  const info = getResultInfo(result.type);
  
  // Si no hay info válida, no mostrar nada
  if (!info) return null;
  
  const showRoll = result.roll !== null && result.dc !== null;

  return (
    <div className={`result-display result-display--${info.color}`} onClick={onDismiss}>
      <div className="result-display__content">
        <span className="result-display__icon">{info.icon}</span>
        <span className="result-display__title">{info.title}</span>
        {showRoll && (
          <div className="result-display__roll">
            <span className="result-display__roll-value">{result.roll}</span>
            <span className="result-display__roll-vs">vs CD</span>
            <span className="result-display__roll-dc">{result.dc}</span>
          </div>
        )}
        {result.skill && (
          <span className="result-display__skill">{translateName(result.skill)}</span>
        )}
        {result.attribute && (
          <span className="result-display__skill">{translateName(result.attribute)}</span>
        )}
      </div>
      <span className="result-display__dismiss">Click para continuar</span>
    </div>
  );
};

// Main AdventurePanel component
const AdventurePanel = ({ 
  narrative, 
  options = [], 
  character,
  onSelectOption, 
  loading = false,
  lastResult = null,
  onResetGame,
}) => {
  const [showResult, setShowResult] = useState(false);
  const { characterSheet, character: contextCharacter } = useGame();

  // Tipos de resultado que queremos mostrar con overlay
  React.useEffect(() => {
    const showableResultTypes = ['check_passed', 'check_failed', 'save_passed', 'save_failed'];
    // Solo mostrar el overlay para tipos específicos de resultado
    if (lastResult && showableResultTypes.includes(lastResult.type)) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [lastResult]);

  const handleOptionClick = async (optionId) => {
    if (loading) return;
    setShowResult(false); // Ocultar resultado anterior inmediatamente
    await onSelectOption(optionId);
  };

  const dismissResult = () => {
    setShowResult(false);
  };

  return (
    <div className="adventure-panel">
      {/* Result overlay */}
      {showResult && lastResult && (
        <ResultDisplay result={lastResult} onDismiss={dismissResult} />
      )}

      {/* Character mini status */}
      {character && (
        <div className="adventure-panel__status">
          <Panel variant="transparent" className="status-mini">
            <div className="status-mini__content">
              <div className="status-mini__portrait">
                <span>🦹</span>
              </div>
              <div className="status-mini__info">
                <span className="status-mini__name">{contextCharacter?.name || characterSheet?.basicInfo?.name || 'Aventurero'}</span>
                <StatBar
                  current={character.currentHP}
                  max={character.maxHP}
                  variant="health"
                  size="small"
                  showText={false}
                />
                <span className="status-mini__hp">
                  {character.currentHP}/{character.maxHP} PV
                </span>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* Main narrative */}
      <div className="adventure-panel__main">
        <Panel variant="parchment" className="narrative-panel">
          {/* Decorative header */}
          <div className="narrative-panel__header">
            <div className="narrative-panel__ornament left">❧</div>
            <span className="narrative-panel__chapter">Capítulo I</span>
            <div className="narrative-panel__ornament right">❧</div>
          </div>

          {/* Narrative text */}
          <div className="narrative-panel__content">
            {loading && !narrative ? (
              <div className="narrative-panel__loading">
                <span className="loading-quill">✒️</span>
                <span>Cargando historia...</span>
              </div>
            ) : (
              <p className="narrative-panel__text">{narrative}</p>
            )}
          </div>

          {/* Decorative footer */}
          <div className="narrative-panel__footer">
            <span>✦</span>
          </div>
        </Panel>
      </div>

      {/* Options */}
      <div className="adventure-panel__options">
        <Panel variant="dark" title="¿Qué deseas hacer?" icon="🎯">
          {options.length === 0 ? (
            <div className="options-empty">
              <span>No hay opciones disponibles</span>
              {onResetGame && (
                <button 
                  className="reset-game-button"
                  onClick={onResetGame}
                  disabled={loading}
                >
                  <span className="reset-game-button__icon">🔄</span>
                  <span className="reset-game-button__text">Reiniciar Aventura</span>
                </button>
              )}
            </div>
          ) : (
            <div className="options-list">
              {options.map((option) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  onClick={handleOptionClick}
                  disabled={loading}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default AdventurePanel;
