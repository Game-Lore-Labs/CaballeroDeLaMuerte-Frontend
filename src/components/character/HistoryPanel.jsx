// ============================================================================
// src/components/character/HistoryPanel.jsx - Adventure History Timeline
// ============================================================================

import React from 'react';
import { Panel } from '../ui';
import './HistoryPanel.css';

// Individual history entry
const HistoryEntry = ({ entryId, index, isLatest, total }) => {
  // Generate entry info from ID
  const getEntryInfo = (id) => {
    // This would normally come from the entries data
    const entryNames = {
      0: { name: 'Inicio', desc: 'Tu aventura comienza...', icon: '🏰' },
      1: { name: 'La Entrada', desc: 'Te encuentras frente a las puertas del castillo.', icon: '🚪' },
      2: { name: 'El Pasillo', desc: 'Un largo corredor se extiende ante ti.', icon: '🛤️' },
      3: { name: 'La Bifurcación', desc: 'El camino se divide en dos.', icon: '⚔️' },
      4: { name: 'La Sala del Trono', desc: 'Una majestuosa sala de piedra.', icon: '👑' },
      5: { name: 'Las Mazmorras', desc: 'Oscuridad y humedad te rodean.', icon: '⛓️' },
    };
    
    return entryNames[id] || { 
      name: `Escena ${id}`, 
      desc: 'Continúas tu aventura...', 
      icon: '📍' 
    };
  };

  const info = getEntryInfo(entryId);

  return (
    <div className={`history-entry ${isLatest ? 'history-entry--latest' : ''}`}>
      {/* Timeline connector */}
      <div className="history-entry__timeline">
        <div className="history-entry__line top" />
        <div className="history-entry__node">
          <span className="history-entry__node-icon">{info.icon}</span>
        </div>
        {index < total - 1 && <div className="history-entry__line bottom" />}
      </div>
      
      {/* Entry content */}
      <div className="history-entry__content">
        <div className="history-entry__header">
          <span className="history-entry__number">#{index + 1}</span>
          <h4 className="history-entry__title">{info.name}</h4>
          {isLatest && <span className="history-entry__badge">Actual</span>}
        </div>
        <p className="history-entry__description">{info.desc}</p>
        <span className="history-entry__id">Entrada: {entryId}</span>
      </div>
    </div>
  );
};

// Statistics component
const HistoryStats = ({ history, currentEntry }) => {
  const uniqueEntries = new Set([...history, currentEntry]).size;
  
  return (
    <div className="history-stats">
      <div className="history-stat">
        <span className="history-stat__value">{history.length + 1}</span>
        <span className="history-stat__label">Escenas visitadas</span>
      </div>
      <div className="history-stat">
        <span className="history-stat__value">{uniqueEntries}</span>
        <span className="history-stat__label">Escenas únicas</span>
      </div>
      <div className="history-stat">
        <span className="history-stat__value">{currentEntry}</span>
        <span className="history-stat__label">Escena actual</span>
      </div>
    </div>
  );
};

// Main HistoryPanel component
const HistoryPanel = ({ history = [], currentEntry = 0 }) => {
  // Combine history with current entry for display
  const allEntries = [...history, currentEntry];
  
  return (
    <div className="history-panel">
      {/* Main timeline panel */}
      <Panel variant="dark" className="history-panel__main">
        {/* Header */}
        <div className="history-panel__header">
          <span className="history-panel__header-icon">📜</span>
          <h2 className="history-panel__title">Crónica de la Aventura</h2>
        </div>
        
        {/* Statistics */}
        <HistoryStats history={history} currentEntry={currentEntry} />
        
        {/* Divider */}
        <div className="history-panel__divider">
          <span>✦</span>
        </div>
        
        {/* Timeline */}
        {allEntries.length === 0 ? (
          <div className="history-panel__empty">
            <p>Tu aventura aún no ha comenzado.</p>
          </div>
        ) : (
          <div className="history-panel__timeline">
            {allEntries.map((entryId, index) => (
              <HistoryEntry
                key={`${entryId}-${index}`}
                entryId={entryId}
                index={index}
                isLatest={index === allEntries.length - 1}
                total={allEntries.length}
              />
            ))}
          </div>
        )}
      </Panel>

      {/* Side panel - Adventure notes */}
      <Panel variant="parchment" className="history-panel__notes">
        <h3 className="history-notes__title">Notas del Aventurero</h3>
        
        <div className="history-notes__content">
          <div className="history-note">
            <span className="history-note__icon">🗡️</span>
            <div className="history-note__text">
              <strong>Combates:</strong>
              <p>Recuerda que cada combate puede cambiar el rumbo de tu aventura.</p>
            </div>
          </div>
          
          <div className="history-note">
            <span className="history-note__icon">🎲</span>
            <div className="history-note__text">
              <strong>Tiradas:</strong>
              <p>Las pruebas de habilidad determinan el éxito de muchas acciones.</p>
            </div>
          </div>
          
          <div className="history-note">
            <span className="history-note__icon">🔄</span>
            <div className="history-note__text">
              <strong>Decisiones:</strong>
              <p>Cada elección que hagas tiene consecuencias.</p>
            </div>
          </div>
        </div>
        
        {/* Decorative seal */}
        <div className="history-notes__seal">
          <span>⚜</span>
        </div>
      </Panel>
    </div>
  );
};

export default HistoryPanel;
