// ============================================================================
// src/components/game/CombatModal.jsx - Combat Arena Modal
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import './CombatModal.css';

// Enemy card component for the modal
const EnemyCard = ({ enemy, index, isTargeted, onTarget, isDefeated, isAttacking }) => {
  const hpPercentage = (enemy.currentHP / enemy.maxHP) * 100;
  
  // Get enemy icon based on name
  const getEnemyIcon = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('araña') || nameLower.includes('spider')) return '🕷️';
    if (nameLower.includes('lobo') || nameLower.includes('wolf')) return '🐺';
    if (nameLower.includes('goblin')) return '👺';
    if (nameLower.includes('esqueleto') || nameLower.includes('skeleton')) return '💀';
    if (nameLower.includes('zombie')) return '🧟';
    if (nameLower.includes('dragón') || nameLower.includes('dragon')) return '🐉';
    if (nameLower.includes('orco') || nameLower.includes('orc')) return '👹';
    return '👹';
  };
  
  return (
    <div 
      className={`
        combat-modal-enemy 
        ${isTargeted ? 'combat-modal-enemy--targeted' : ''} 
        ${isDefeated ? 'combat-modal-enemy--defeated' : ''}
        ${isAttacking ? 'combat-modal-enemy--attacking' : ''}
      `}
      onClick={() => !isDefeated && onTarget(index)}
    >
      <div className="combat-modal-enemy__portrait">
        <span className="combat-modal-enemy__icon">{getEnemyIcon(enemy.name)}</span>
        {isTargeted && <div className="combat-modal-enemy__target">🎯</div>}
        {isDefeated && <div className="combat-modal-enemy__death-overlay">💀</div>}
      </div>
      
      <div className="combat-modal-enemy__info">
        <h4 className="combat-modal-enemy__name">{enemy.name}</h4>
        <div className="combat-modal-enemy__hp-bar">
          <div 
            className="combat-modal-enemy__hp-fill"
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          />
          <span className="combat-modal-enemy__hp-text">
            {enemy.currentHP}/{enemy.maxHP}
          </span>
        </div>
        <div className="combat-modal-enemy__stats">
          <span className="combat-modal-enemy__stat">
            🛡️ {enemy.ac}
          </span>
        </div>
      </div>
    </div>
  );
};

// Combat log entry
const CombatLogEntry = ({ entry }) => {
  const getEntryStyle = (type) => {
    switch (type) {
      case 'player_hit':
        return { icon: '⚔️', className: 'log-hit' };
      case 'player_miss':
        return { icon: '💨', className: 'log-miss' };
      case 'player_critical':
        return { icon: '💥', className: 'log-critical-hit' };
      case 'enemy_hit':
        return { icon: '🩸', className: 'log-damage' };
      case 'enemy_miss':
        return { icon: '🛡️', className: 'log-blocked' };
      case 'enemy_defeated':
        return { icon: '☠️', className: 'log-kill' };
      case 'player_defeated':
        return { icon: '💀', className: 'log-death' };
      case 'combat_start':
        return { icon: '⚔️', className: 'log-start' };
      case 'round':
        return { icon: '🔄', className: 'log-round' };
      default:
        return { icon: '📜', className: '' };
    }
  };

  const style = getEntryStyle(entry.type);

  return (
    <div className={`combat-modal-log-entry ${style.className}`}>
      <span className="combat-modal-log-entry__icon">{style.icon}</span>
      <span className="combat-modal-log-entry__text">{entry.message}</span>
    </div>
  );
};

// Main CombatModal component
const CombatModal = ({ 
  isOpen,
  combatState,
  onAttack,
  onEnemyTurn,
  onEndCombat,
  loading = false,
}) => {
  const { characterSheet, character } = useGame();
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showDamageNumber, setShowDamageNumber] = useState(null);
  const [playerAnimation, setPlayerAnimation] = useState('');
  const [enemyAnimation, setEnemyAnimation] = useState(-1);
  const logRef = useRef(null);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  // Reset state when combat starts
  useEffect(() => {
    if (isOpen && combatState) {
      setCombatLog([{ 
        type: 'combat_start', 
        message: '¡El combate ha comenzado!' 
      }]);
      setTargetIndex(0);
      setSelectedWeaponIndex(0);
      setIsPlayerTurn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Auto-target first alive enemy when current target dies
  useEffect(() => {
    if (combatState?.enemies) {
      const currentTarget = combatState.enemies[targetIndex];
      if (!currentTarget || currentTarget.currentHP <= 0) {
        const firstAliveIndex = combatState.enemies.findIndex(e => e.currentHP > 0);
        if (firstAliveIndex >= 0) {
          setTargetIndex(firstAliveIndex);
        }
      }
    }
  }, [combatState?.enemies, targetIndex]);

  if (!isOpen || !combatState) {
    return null;
  }

  const { player, enemies = [], state: combatStatus = 'InProgress' } = combatState;
  
  // Verificar estado de victoria/derrota PRIMERO
  const isVictory = combatStatus === 'Victory';
  const isDefeat = combatStatus === 'Defeat';
  const isCombatOver = isVictory || isDefeat;
  
  // Si el combate terminó, mostrar pantalla de victoria/derrota aunque no haya datos de player/enemies
  if (isCombatOver) {
    return (
      <div className="combat-modal-overlay">
        <div className="combat-modal">
          <div className="combat-modal__header">
            <div className="combat-modal__title-container">
              <div className="combat-modal__swords">⚔️</div>
              <h2 className="combat-modal__title">COMBATE</h2>
              <div className="combat-modal__swords">⚔️</div>
            </div>
          </div>
          <div className="combat-modal__arena" style={{ justifyContent: 'center', padding: '4rem' }}>
            <div className={`combat-result-display ${isVictory ? 'victory' : 'defeat'}`}>
              <div className="combat-result-display__icon">
                {isVictory ? '🏆' : '💀'}
              </div>
              <h2 className="combat-result-display__title">
                {isVictory ? '¡Victoria Gloriosa!' : 'Has Caído en Batalla'}
              </h2>
              <p className="combat-result-display__message">
                {isVictory 
                  ? 'Has derrotado a todos tus enemigos. ¡Tu leyenda crece!'
                  : 'La oscuridad te ha consumido... pero tu historia no termina aquí.'}
              </p>
              <button 
                className={`combat-btn ${isVictory ? 'combat-btn--victory' : 'combat-btn--defeat'}`}
                onClick={onEndCombat}
                disabled={loading}
              >
                {isVictory ? 'Continuar Aventura' : 'Aceptar Destino'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!player || !enemies || enemies.length === 0) {
    // Mostrar un estado de carga mientras se obtienen los datos
    return (
      <div className="combat-modal-overlay">
        <div className="combat-modal">
          <div className="combat-modal__header">
            <div className="combat-modal__title-container">
              <div className="combat-modal__swords">⚔️</div>
              <h2 className="combat-modal__title">COMBATE</h2>
              <div className="combat-modal__swords">⚔️</div>
            </div>
          </div>
          <div className="combat-modal__arena" style={{ justifyContent: 'center', padding: '4rem' }}>
            <div style={{ textAlign: 'center', color: 'var(--gold-mid)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Preparando combate...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const playerHpPercentage = (player.currentHP / player.maxHP) * 100;

  // Obtener las armas del jugador - priorizar character.weapons que tiene el formato nuevo
  // Formato: { index, name, damageDice, damageType, range }
  const playerWeapons = character?.weapons || 
                        characterSheet?.combatStats?.weapons || 
                        characterSheet?.weapons || 
                        player?.weapons || 
                        [];
  
  // Si no hay armas, usar arma por defecto
  const weapons = playerWeapons.length > 0 ? playerWeapons : [
    { index: 0, name: 'Ataque desarmado', damageDice: '1d4', damageType: 'Bludgeoning', range: [5, 5] }
  ];
  
  const selectedWeapon = weapons[selectedWeaponIndex] || weapons[0];
  
  // Obtener el índice real del arma para enviar al backend
  const getWeaponIndex = (weapon) => {
    return weapon.index !== undefined ? weapon.index : selectedWeaponIndex;
  };
  
  // Determinar si es arma a distancia
  const isRangedWeapon = (weapon) => {
    if (!weapon.range) return false;
    const [min, max] = weapon.range;
    return max > min || max > 10;
  };

  const addLogEntry = (type, message) => {
    setCombatLog(prev => [...prev, { type, message, timestamp: Date.now() }]);
  };

  const handleAttack = async () => {
    if (loading || !isPlayerTurn || isCombatOver) return;
    
    const targetEnemy = enemies[targetIndex];
    if (!targetEnemy || targetEnemy.currentHP <= 0) return;

    setIsPlayerTurn(false);
    setPlayerAnimation('attacking');
    
    try {
      // Pasar tanto el índice del objetivo como el índice del arma (usando el index real del backend)
      const weaponIdx = getWeaponIndex(selectedWeapon);
      const result = await onAttack(targetIndex, weaponIdx);
      
      // Handle attack result
      setTimeout(() => {
        setPlayerAnimation('');
        
        // El backend devuelve: { actions: [...], status: {...} }
        // O puede devolver directamente el action si el GameContext lo procesa
        const actions = result.actions || [result];
        
        // Buscar las acciones relevantes (soportar snake_case y PascalCase)
        const hitAction = actions.find(a => a.type === 'player_hit' || a.type === 'PlayerHit');
        const missAction = actions.find(a => a.type === 'player_miss' || a.type === 'PlayerMiss');
        const defeatedAction = actions.find(a => a.type === 'enemy_defeated' || a.type === 'EnemyDefeated');
        const victoryStatus = result.status?.state === 'Victory';
        
        if (hitAction) {
          // ¡Golpe exitoso!
          setEnemyAnimation(targetIndex);
          
          const damage = hitAction.damage || 0;
          const roll = hitAction.roll || '?';
          
          setShowDamageNumber({ 
            value: damage, 
            x: 70, 
            y: 30,
            critical: roll === 20
          });
          
          addLogEntry(
            roll === 20 ? 'player_critical' : 'player_hit',
            roll === 20 
              ? `¡CRÍTICO! Golpeas a ${targetEnemy.name} por ${damage} de daño!`
              : `Golpeas a ${targetEnemy.name} por ${damage} de daño (${roll} vs CA ${targetEnemy.ac})`
          );
          
          // Si también hay EnemyDefeated, mostrar mensaje de derrota
          if (defeatedAction) {
            setTimeout(() => {
              addLogEntry('enemy_defeated', `¡${targetEnemy.name} ha sido derrotado!`);
            }, 300);
          }
          
          setTimeout(() => {
            setEnemyAnimation(-1);
            setShowDamageNumber(null);
          }, 600);
          
        } else if (missAction) {
          // Fallo
          const missRoll = missAction.roll || '?';
          addLogEntry(
            'player_miss',
            `Tu ataque falla contra ${targetEnemy.name} (${missRoll} vs CA ${targetEnemy.ac})`
          );
        } else if (defeatedAction && !hitAction) {
          // Solo EnemyDefeated sin PlayerHit (caso raro pero posible)
          addLogEntry('enemy_defeated', `¡${targetEnemy.name} ha sido derrotado!`);
        } else {
          // Fallback - intentar detectar por campos legacy
          const hasLegacyHit = result.damage > 0 || result.type === 'PlayerHit';
          if (hasLegacyHit) {
            const damage = result.damage || 0;
            const roll = result.roll || '?';
            setEnemyAnimation(targetIndex);
            setShowDamageNumber({ value: damage, x: 70, y: 30, critical: false });
            addLogEntry('player_hit', `Golpeas a ${targetEnemy.name} por ${damage} de daño (${roll} vs CA ${targetEnemy.ac})`);
            setTimeout(() => { setEnemyAnimation(-1); setShowDamageNumber(null); }, 600);
          } else {
            const missRoll = result.roll || '?';
            addLogEntry('player_miss', `Tu ataque falla contra ${targetEnemy.name} (${missRoll} vs CA ${targetEnemy.ac})`);
          }
        }
        
        // Verificar si el combate terminó - solo termina con Victory o Defeat, NO solo por derrotar un enemigo
        const combatStatus = result.status?.state;
        const combatEnded = combatStatus === 'Victory' || combatStatus === 'Defeat';
        
        if (!combatEnded && onEnemyTurn) {
          // Turno del enemigo
          setTimeout(async () => {
            addLogEntry('round', '--- Turno del enemigo ---');
            
            try {
              const enemyResults = await onEnemyTurn();
              
              // El backend devuelve: { actions: [...], status: {...} }
              const enemyActions = enemyResults?.actions || (Array.isArray(enemyResults) ? enemyResults : [enemyResults]);
              
              // Procesar cada acción del enemigo (soportar snake_case y PascalCase)
              enemyActions.forEach(action => {
                const actionType = (action.type || '').toLowerCase();
                const actorName = action.actor || 'Enemigo';
                const damage = action.damage || 0;
                const roll = action.roll || '?';
                
                if (actionType === 'enemy_hit' || actionType === 'enemyhit') {
                  // Enemigo te golpea
                  setPlayerAnimation('damaged');
                  addLogEntry('enemy_hit', `${actorName} te golpea por ${damage} de daño (${roll} vs CA ${player.ac})`);
                  setTimeout(() => setPlayerAnimation(''), 500);
                } else if (actionType === 'enemy_miss' || actionType === 'enemymiss') {
                  // Enemigo falla
                  addLogEntry('enemy_miss', `${actorName} falla su ataque (${roll} vs CA ${player.ac})`);
                } else if (actionType === 'player_defeated' || actionType === 'playerdefeated') {
                  // Jugador derrotado
                  addLogEntry('player_defeated', '¡Has sido derrotado!');
                }
              });
              
              // Verificar si el combate terminó por derrota
              const isDefeat = enemyResults?.status?.state === 'Defeat';
              if (!isDefeat) {
                setTimeout(() => {
                  addLogEntry('round', '--- Tu turno ---');
                  setIsPlayerTurn(true);
                }, 600);
              }
            } catch (err) {
              setIsPlayerTurn(true);
            }
          }, 800);
        } else if (combatEnded) {
          // Combate terminado - no habilitar turno del jugador
          if (combatStatus === 'Victory') {
            addLogEntry('combat_victory', '¡Victoria! Has derrotado a todos los enemigos.');
          } else if (combatStatus === 'Defeat') {
            addLogEntry('player_defeated', '¡Has sido derrotado!');
          }
        }
      }, 400);
      
    } catch (err) {
      setPlayerAnimation('');
      setIsPlayerTurn(true);
      addLogEntry('player_miss', 'Error al atacar');
    }
  };

  const handleEndCombat = () => {
    if (loading) return;
    setCombatLog([]);
    onEndCombat();
  };

  return (
    <div className="combat-modal-overlay">
      <div className="combat-modal">
        {/* Combat Header */}
        <div className="combat-modal__header">
          <div className="combat-modal__flames combat-modal__flames--left">
            🔥
          </div>
          <div className="combat-modal__title-container">
            <div className="combat-modal__swords">⚔️</div>
            <h2 className="combat-modal__title">COMBATE</h2>
            <div className="combat-modal__swords">⚔️</div>
          </div>
          <div className="combat-modal__flames combat-modal__flames--right">
            🔥
          </div>
        </div>

        {/* Status Banner */}
        <div className={`combat-modal__status-banner status-${combatStatus.toLowerCase()}`}>
          {combatStatus === 'InProgress' && (
            <span>⚔️ En Progreso - Ronda de Combate ⚔️</span>
          )}
          {isVictory && (
            <span>🏆 ¡VICTORIA! 🏆</span>
          )}
          {isDefeat && (
            <span>💀 DERROTA 💀</span>
          )}
        </div>

        {/* Main Arena */}
        <div className="combat-modal__arena">
          {/* Player Section */}
          <div className="combat-modal__player-section">
            <div className={`combat-modal__player ${playerAnimation}`}>
              <div className="combat-modal__player-card">
                <div className="combat-modal__player-portrait">
                  <div className="combat-modal__player-frame">
                    <video 
                      className="combat-modal__player-video"
                      src="/video/iksapen.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  {showDamageNumber && showDamageNumber.x < 50 && (
                    <div className={`damage-number ${showDamageNumber.critical ? 'critical' : ''}`}>
                      -{showDamageNumber.value}
                    </div>
                  )}
                </div>
                <div className="combat-modal__player-info">
                  <h3 className="combat-modal__player-name">
                    {character?.name || characterSheet?.basicInfo?.name || 'Aventurero'}
                  </h3>
                  <p className="combat-modal__player-class">
                    {character?.class || characterSheet?.basicInfo?.class || 'Pícaro'} • Nivel {character?.level || characterSheet?.basicInfo?.level || 1}
                  </p>
                </div>
              </div>
              <div className="combat-modal__player-vitals">
                <div className="combat-modal__player-hp">
                  <div className="hp-bar">
                    <div 
                      className="hp-bar__fill"
                      style={{ width: `${Math.max(0, playerHpPercentage)}%` }}
                    />
                    <span className="hp-bar__text">
                      ❤️ {player.currentHP}/{player.maxHP}
                    </span>
                  </div>
                </div>
                <div className="combat-modal__player-stats">
                  <span className="stat-badge">🛡️ CA: {player.ac}</span>
                </div>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="combat-modal__vs">
            <div className="combat-modal__vs-decoration">✧</div>
            <div className="combat-modal__vs-text">VS</div>
            <div className="combat-modal__vs-decoration">✧</div>
          </div>

          {/* Enemies Section */}
          <div className="combat-modal__enemies-section">
            {enemies.map((enemy, index) => (
              <EnemyCard
                key={`${enemy.name}-${index}-${enemy.currentHP}`}
                enemy={enemy}
                index={index}
                isTargeted={targetIndex === index && !isCombatOver}
                onTarget={setTargetIndex}
                isDefeated={enemy.currentHP <= 0}
                isAttacking={enemyAnimation === index}
              />
            ))}
            {showDamageNumber && showDamageNumber.x >= 50 && (
              <div 
                className={`damage-number floating ${showDamageNumber.critical ? 'critical' : ''}`}
                style={{ top: `${showDamageNumber.y}%` }}
              >
                -{showDamageNumber.value}
              </div>
            )}
          </div>
        </div>

        {/* Combat Actions */}
        <div className="combat-modal__actions">
          {!isCombatOver ? (
            <div className="combat-modal__action-panel">
              <div className="combat-modal__turn-indicator">
                {isPlayerTurn ? (
                  <span className="turn-badge turn-badge--player">
                    🎯 ¡Tu Turno!
                  </span>
                ) : (
                  <span className="turn-badge turn-badge--enemy">
                    ⏳ Procesando...
                  </span>
                )}
              </div>
              
              {/* Selector de Armas */}
              {weapons.length > 1 && (
                <div className="combat-modal__weapon-selector">
                  <span className="weapon-selector__label">⚔️ Arma:</span>
                  <div className="weapon-selector__options">
                    {weapons.map((weapon, index) => {
                      const ranged = isRangedWeapon(weapon);
                      const weaponIcon = ranged ? '🏹' :
                                        weapon.name?.toLowerCase().includes('daga') ? '🗡️' :
                                        weapon.name?.toLowerCase().includes('espada') ? '⚔️' :
                                        '⚔️';
                      return (
                        <button
                          key={weapon.index ?? index}
                          className={`weapon-btn ${selectedWeaponIndex === index ? 'weapon-btn--selected' : ''} ${ranged ? 'weapon-btn--ranged' : ''}`}
                          onClick={() => setSelectedWeaponIndex(index)}
                          disabled={!isPlayerTurn || loading}
                          title={`${weapon.damageDice} ${weapon.damageType || ''} | Rango: ${weapon.range ? weapon.range.join('-') : '5'}ft`}
                        >
                          <span className="weapon-btn__icon">{weaponIcon}</span>
                          <span className="weapon-btn__name">{weapon.name}</span>
                          <span className="weapon-btn__damage">{weapon.damageDice}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="combat-modal__buttons">
                <button
                  className="combat-btn combat-btn--attack"
                  onClick={handleAttack}
                  disabled={loading || !isPlayerTurn}
                >
                  <span className="combat-btn__icon">⚔️</span>
                  <span className="combat-btn__text">ATACAR</span>
                  {enemies[targetIndex] && (
                    <span className="combat-btn__target">
                      con {selectedWeapon?.name || 'arma'} → {enemies[targetIndex].name}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="combat-modal__hint">
                💡 Haz clic en un enemigo para seleccionarlo como objetivo
              </div>
            </div>
          ) : (
            <div className="combat-modal__result">
              <div className={`combat-result-display ${isVictory ? 'victory' : 'defeat'}`}>
                <div className="combat-result-display__icon">
                  {isVictory ? '🏆' : '💀'}
                </div>
                <h3 className="combat-result-display__title">
                  {isVictory ? '¡Victoria Gloriosa!' : 'Has Caído en Batalla'}
                </h3>
                <p className="combat-result-display__subtitle">
                  {isVictory 
                    ? 'Has derrotado a todos los enemigos' 
                    : 'Tu aventura ha llegado a su fin...'
                  }
                </p>
                <button
                  className={`combat-btn ${isVictory ? 'combat-btn--victory' : 'combat-btn--defeat'}`}
                  onClick={handleEndCombat}
                  disabled={loading}
                >
                  <span className="combat-btn__text">
                    {isVictory ? 'Continuar Aventura' : 'Aceptar Destino'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Combat Log */}
        <div className="combat-modal__log">
          <div className="combat-modal__log-header">
            <span className="log-header__icon">📜</span>
            <span className="log-header__title">Registro de Combate</span>
          </div>
          <div className="combat-modal__log-content" ref={logRef}>
            {combatLog.map((entry, index) => (
              <CombatLogEntry key={index} entry={entry} />
            ))}
          </div>
        </div>

        {/* Decorative corners */}
        <div className="combat-modal__corner combat-modal__corner--tl">⚜️</div>
        <div className="combat-modal__corner combat-modal__corner--tr">⚜️</div>
        <div className="combat-modal__corner combat-modal__corner--bl">⚜️</div>
        <div className="combat-modal__corner combat-modal__corner--br">⚜️</div>
      </div>
    </div>
  );
};

export default CombatModal;
