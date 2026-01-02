// ============================================================================
// src/components/game/CombatPanel.jsx - Combat Interface
// ============================================================================

import React, { useState } from 'react';
import { Panel, Button, StatBar } from '../ui';
import './CombatPanel.css';

// Enemy card component
const EnemyCard = ({ enemy, index, isTargeted, onTarget, isDefeated }) => {
  const hpPercentage = (enemy.currentHP / enemy.maxHP) * 100;
  
  return (
    <div 
      className={`enemy-card ${isTargeted ? 'enemy-card--targeted' : ''} ${isDefeated ? 'enemy-card--defeated' : ''}`}
      onClick={() => !isDefeated && onTarget(index)}
    >
      <div className="enemy-card__portrait">
        <span className="enemy-card__icon">👹</span>
        {isTargeted && <div className="enemy-card__target-indicator">🎯</div>}
        {isDefeated && <div className="enemy-card__defeated-overlay">💀</div>}
      </div>
      
      <div className="enemy-card__info">
        <h4 className="enemy-card__name">{enemy.name}</h4>
        <StatBar
          current={enemy.currentHP}
          max={enemy.maxHP}
          variant="health"
          size="small"
        />
        <div className="enemy-card__stats">
          <span className="enemy-card__stat">
            <span className="stat-icon">🛡️</span>
            <span className="stat-value">{enemy.ac}</span>
          </span>
          <span className="enemy-card__stat">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{enemy.currentHP}/{enemy.maxHP}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Combat log entry
const CombatLogEntry = ({ entry, index }) => {
  const getEntryStyle = (type) => {
    switch (type) {
      case 'player_hit':
        return { icon: '⚔️', className: 'log-success' };
      case 'player_miss':
        return { icon: '💨', className: 'log-miss' };
      case 'enemy_hit':
        return { icon: '💥', className: 'log-damage' };
      case 'enemy_miss':
        return { icon: '🛡️', className: 'log-miss' };
      case 'enemy_defeated':
        return { icon: '💀', className: 'log-success' };
      case 'player_defeated':
        return { icon: '☠️', className: 'log-critical' };
      default:
        return { icon: '📜', className: '' };
    }
  };

  const style = getEntryStyle(entry.type);

  return (
    <div className={`combat-log-entry ${style.className}`}>
      <span className="combat-log-entry__icon">{style.icon}</span>
      <span className="combat-log-entry__text">{entry.message}</span>
    </div>
  );
};

// Main CombatPanel component
const CombatPanel = ({ 
  combatState, 
  onAttack, 
  onEndCombat,
  loading = false,
}) => {
  const [targetIndex, setTargetIndex] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  if (!combatState) {
    return (
      <div className="combat-panel combat-panel--empty">
        <Panel variant="dark" title="Combate" icon="⚔️">
          <p className="empty-message">No hay combate activo</p>
        </Panel>
      </div>
    );
  }

  const { player, enemies = [], state: combatStatus = 'InProgress' } = combatState;
  
  // Validar que player y enemies existan
  if (!player || !enemies) {
    return (
      <div className="combat-panel combat-panel--empty">
        <Panel variant="dark" title="Combate" icon="⚔️">
          <p className="empty-message">Cargando combate...</p>
        </Panel>
      </div>
    );
  }
  
  const aliveEnemies = enemies.filter(e => e.currentHP > 0);
  const isVictory = combatStatus === 'Victory';
  const isDefeat = combatStatus === 'Defeat';
  const isCombatOver = isVictory || isDefeat;

  const handleAttack = async () => {
    if (loading || !isPlayerTurn || isCombatOver) return;
    
    const targetEnemy = enemies[targetIndex];
    if (!targetEnemy || targetEnemy.currentHP <= 0) return;

    setIsPlayerTurn(false);
    
    try {
      const result = await onAttack(targetIndex);
      
      // Add to combat log
      let message = '';
      if (result.type === 'player_hit') {
        message = `¡Golpeas a ${targetEnemy.name} por ${result.damage} de daño!`;
      } else if (result.type === 'player_miss') {
        message = `Tu ataque falla (${result.roll})`;
      } else if (result.type === 'enemy_defeated') {
        message = `¡${result.actor} ha sido derrotado!`;
      }
      
      setCombatLog(prev => [...prev, { type: result.type, message }]);
      
      // Wait a moment then process enemy turn
      setTimeout(() => {
        setIsPlayerTurn(true);
      }, 1000);
    } catch (err) {
      setIsPlayerTurn(true);
    }
  };

  const handleEndCombat = () => {
    if (loading) return;
    onEndCombat();
  };

  return (
    <div className="combat-panel">
      {/* Combat header */}
      <div className="combat-panel__header">
        <div className="combat-header__title">
          <span className="combat-header__icon">⚔️</span>
          <h2>¡COMBATE!</h2>
        </div>
        <div className={`combat-header__status ${combatStatus.toLowerCase()}`}>
          {combatStatus === 'InProgress' && 'En progreso'}
          {isVictory && '¡Victoria!'}
          {isDefeat && 'Derrota'}
        </div>
      </div>

      {/* Main combat area */}
      <div className="combat-panel__arena">
        {/* Player side */}
        <div className="combat-arena__player">
          <Panel variant="dark" className="player-combat-card">
            <div className="player-combat-card__portrait">
              <span>🦹</span>
            </div>
            <h3 className="player-combat-card__name">Jugador</h3>
            <StatBar
              current={player.currentHP || 0}
              max={player.maxHP || 1}
              label="PV"
              variant="health"
              size="medium"
            />
            <div className="player-combat-card__stats">
              <span>CA: {player.ac || 0}</span>
            </div>
          </Panel>
        </div>

        {/* VS indicator */}
        <div className="combat-arena__vs">
          <span className="vs-text">VS</span>
          <div className="vs-swords">⚔️</div>
        </div>

        {/* Enemies side */}
        <div className="combat-arena__enemies">
          {enemies.map((enemy, index) => (
            <EnemyCard
              key={index}
              enemy={enemy}
              index={index}
              isTargeted={targetIndex === index && !isCombatOver}
              onTarget={setTargetIndex}
              isDefeated={enemy.currentHP <= 0}
            />
          ))}
        </div>
      </div>

      {/* Combat actions */}
      <div className="combat-panel__actions">
        {!isCombatOver ? (
          <Panel variant="dark" className="combat-actions-panel">
            <div className="combat-actions">
              <div className="combat-actions__info">
                <span className="turn-indicator">
                  {isPlayerTurn ? '🎯 Tu turno' : '⏳ Turno del enemigo'}
                </span>
                {aliveEnemies.length > 0 && (
                  <span className="target-info">
                    Objetivo: {enemies[targetIndex]?.name}
                  </span>
                )}
              </div>
              
              <div className="combat-actions__buttons">
                <Button
                  variant="danger"
                  onClick={handleAttack}
                  disabled={loading || !isPlayerTurn}
                  loading={loading}
                  icon="⚔️"
                >
                  Atacar
                </Button>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel variant={isVictory ? 'gold' : 'dark'} className="combat-result-panel">
            <div className="combat-result">
              <span className="combat-result__icon">
                {isVictory ? '🏆' : '💀'}
              </span>
              <h3 className="combat-result__title">
                {isVictory ? '¡Victoria!' : 'Has sido derrotado'}
              </h3>
              <Button
                variant={isVictory ? 'success' : 'secondary'}
                onClick={handleEndCombat}
                disabled={loading}
              >
                Continuar
              </Button>
            </div>
          </Panel>
        )}
      </div>

      {/* Combat log */}
      <div className="combat-panel__log">
        <Panel variant="dark" title="Registro de combate" icon="📜" className="combat-log-panel">
          <div className="combat-log">
            {combatLog.length === 0 ? (
              <p className="combat-log__empty">El combate comienza...</p>
            ) : (
              combatLog.map((entry, index) => (
                <CombatLogEntry key={index} entry={entry} index={index} />
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default CombatPanel;
