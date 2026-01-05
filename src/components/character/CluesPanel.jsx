// ============================================================================
// src/components/character/CluesPanel.jsx - Discovered Clues Panel
// ============================================================================

import React, { useState } from 'react';
import { Panel } from '../ui';
import './CluesPanel.css';

// Get icon based on clue type
const getClueIcon = (type) => {
  const icons = {
    information: '📋',
    scroll: '📜',
    location: '🗺️',
    person: '👤',
    item: '🔑',
    warning: '⚠️',
    secret: '🔐',
  };
  return icons[type] || '🔍';
};

// Individual clue card - now handles both string IDs and object format
const ClueCard = ({ clue, isExpanded, onClick }) => {
  // Handle both formats: string (old) and object (new)
  const isObject = typeof clue === 'object';
  const clueName = isObject ? clue.name : formatClueName(clue);
  const clueType = isObject ? clue.type : 'information';
  const clueDesc = isObject ? (clue.description || getDefaultDescription(clue.name)) : getClueDescription(clue);
  const clueId = isObject ? (clue.id || clue.name) : clue;
  const icon = getClueIcon(clueType);

  return (
    <div 
      className={`clue-card ${isExpanded ? 'clue-card--expanded' : ''}`}
      onClick={onClick}
    >
      <div className="clue-card__header">
        <span className="clue-card__icon">{icon}</span>
        <h4 className="clue-card__title">{clueName}</h4>
        <span className="clue-card__toggle">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="clue-card__body">
          <p className="clue-card__description">{clueDesc}</p>
          <div className="clue-card__meta">
            <span className="clue-card__type">{formatType(clueType)}</span>
          </div>
        </div>
      )}
      
      {/* Decorative seal */}
      <div className="clue-card__seal">
        <span>✦</span>
      </div>
    </div>
  );
};

// Format clue name from ID
const formatClueName = (id) => {
  return id
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

// Format type for display
const formatType = (type) => {
  const types = {
    information: 'Información',
    scroll: 'Pergamino',
    location: 'Ubicación',
    person: 'Persona',
    item: 'Objeto',
    warning: 'Advertencia',
    secret: 'Secreto',
  };
  return types[type] || 'Pista';
};

// Get default description based on name
const getDefaultDescription = (name) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('árbol rojo')) {
    return 'Información crucial sobre el Árbol Rojo y su conexión con el Caballero de la Muerte.';
  }
  if (lowerName.includes('caballero')) {
    return 'Datos importantes sobre el Caballero de la Muerte y cómo derrotarlo.';
  }
  if (lowerName.includes('kiaransalee')) {
    return 'Información sobre la misteriosa Orden de Kiaransalee.';
  }
  
  return 'Una pista importante que has descubierto durante tu aventura.';
};

// Get description from ID (legacy support)
const getClueDescription = (id) => {
  const descriptions = {
    'secret': 'Has descubierto un secreto oculto que podría ser útil más adelante.',
    'passage': 'Un pasaje secreto que conecta con otra área.',
    'trap': 'Información sobre una trampa que debes evitar.',
    'enemy': 'Detalles sobre los enemigos que enfrentarás.',
    'treasure': 'Pistas sobre un tesoro escondido.',
    'key': 'Una pista sobre cómo abrir algo cerrado.',
  };

  const lowerCaseId = id.toLowerCase();
  for (const [key, desc] of Object.entries(descriptions)) {
    if (lowerCaseId.includes(key)) return desc;
  }
  
  return 'Una pista misteriosa que has descubierto durante tu aventura.';
};

// Main CluesPanel component
const CluesPanel = ({ clues = [] }) => {
  const [expandedClue, setExpandedClue] = useState(null);

  const toggleClue = (clueKey) => {
    setExpandedClue(expandedClue === clueKey ? null : clueKey);
  };

  // Get unique key for clue (handles both formats)
  const getClueKey = (clue, index) => {
    if (typeof clue === 'object') {
      return clue.id || clue.name || index;
    }
    return clue;
  };

  return (
    <div className="clues-panel">
      <Panel variant="dark" className="clues-panel__main">
        {/* Header with decorative elements */}
        <div className="clues-panel__header">
          <div className="clues-panel__header-decor left">
            <span>◆</span>
            <div className="line" />
          </div>
          <div className="clues-panel__header-content">
            <span className="clues-panel__header-icon">📜</span>
            <h2 className="clues-panel__title">Diario de Pistas</h2>
          </div>
          <div className="clues-panel__header-decor right">
            <div className="line" />
            <span>◆</span>
          </div>
        </div>

        {/* Clues count */}
        <div className="clues-panel__count">
          <span>Pistas descubiertas: </span>
          <strong>{clues.length}</strong>
        </div>

        {/* Clues list or empty state */}
        {clues.length === 0 ? (
          <div className="clues-panel__empty">
            <div className="clues-panel__empty-icon">🔮</div>
            <p className="clues-panel__empty-text">
              Aún no has descubierto ninguna pista.
            </p>
            <p className="clues-panel__empty-hint">
              Explora con cuidado y presta atención a los detalles de tu aventura.
            </p>
          </div>
        ) : (
          <div className="clues-panel__list">
            {clues.map((clue, index) => {
              const key = getClueKey(clue, index);
              return (
                <ClueCard
                  key={key}
                  clue={clue}
                  isExpanded={expandedClue === key}
                  onClick={() => toggleClue(key)}
                />
              );
            })}
          </div>
        )}

        {/* Footer decoration */}
        <div className="clues-panel__footer">
          <div className="clues-panel__footer-line" />
          <span className="clues-panel__footer-ornament">⚜</span>
          <div className="clues-panel__footer-line" />
        </div>
      </Panel>

      {/* Side panel with tips */}
      <Panel variant="parchment" className="clues-panel__tips">
        <h3 className="clues-tips__title">Consejos del Aventurero</h3>
        <ul className="clues-tips__list">
          <li>
            <span className="tip-icon">💡</span>
            Las pistas pueden revelar pasajes secretos o atajos.
          </li>
          <li>
            <span className="tip-icon">⚠️</span>
            Algunas pistas te advertirán de peligros inminentes.
          </li>
          <li>
            <span className="tip-icon">🗝️</span>
            Ciertas pistas desbloquean nuevas opciones de diálogo.
          </li>
          <li>
            <span className="tip-icon">🎯</span>
            Presta atención a los detalles en cada escena.
          </li>
        </ul>
      </Panel>
    </div>
  );
};

export default CluesPanel;
