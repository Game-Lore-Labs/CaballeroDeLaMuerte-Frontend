// ============================================================================
// src/context/GameContext.jsx - Game State Context Provider
// ============================================================================

import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import api from '../services/api';
import { processEntryEffects, detectCharacterChanges } from '../utils/effectsProcessor';

// Initial state
const initialState = {
  // Game state
  isLoaded: false,
  isLoading: false,
  error: null,
  
  // Current entry
  currentEntry: null,
  narrative: '',
  options: [],
  
  // Player character
  character: null,
  characterSheet: null,
  inventory: [],
  clues: [],
  
  // Game history
  history: [],
  
  // Combat state
  inCombat: false,
  combatState: null,
  
  // UI state
  lastResult: null,
  notifications: [],
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  GAME_LOADED: 'GAME_LOADED',
  UPDATE_ENTRY: 'UPDATE_ENTRY',
  UPDATE_CHARACTER: 'UPDATE_CHARACTER',
  UPDATE_CHARACTER_SHEET: 'UPDATE_CHARACTER_SHEET',
  UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
  SET_OPTION_RESULT: 'SET_OPTION_RESULT',
  ENTER_COMBAT: 'ENTER_COMBAT',
  UPDATE_COMBAT: 'UPDATE_COMBAT',
  EXIT_COMBAT: 'EXIT_COMBAT',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  RESET_GAME: 'RESET_GAME',
};

// Reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
      
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
      
    case ActionTypes.GAME_LOADED:
      return { 
        ...state, 
        isLoaded: true, 
        isLoading: false,
        error: null,
      };
      
    case ActionTypes.UPDATE_ENTRY:
      return {
        ...state,
        currentEntry: action.payload.id,
        narrative: action.payload.narrative,
        options: action.payload.options,
      };
      
    case ActionTypes.UPDATE_CHARACTER:
      return {
        ...state,
        character: action.payload,
      };
      
    case ActionTypes.UPDATE_CHARACTER_SHEET:
      return {
        ...state,
        characterSheet: action.payload,
      };
      
    case ActionTypes.UPDATE_GAME_STATE:
      return {
        ...state,
        character: action.payload.player,
        currentEntry: action.payload.currentEntry,
        history: action.payload.history,
      };
      
    case ActionTypes.SET_OPTION_RESULT:
      return {
        ...state,
        lastResult: action.payload,
      };
      
    case ActionTypes.ENTER_COMBAT:
      return {
        ...state,
        inCombat: true,
        combatState: action.payload,
      };
      
    case ActionTypes.UPDATE_COMBAT:
      // Deep clone para asegurar que React detecte el cambio
      return {
        ...state,
        combatState: action.payload ? {
          ...action.payload,
          player: action.payload.player ? { ...action.payload.player } : null,
          enemies: action.payload.enemies ? action.payload.enemies.map(e => ({ ...e })) : [],
        } : null,
      };
      
    case ActionTypes.EXIT_COMBAT:
      return {
        ...state,
        inCombat: false,
        combatState: null,
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
      
    case ActionTypes.RESET_GAME:
      return initialState;
      
    default:
      return state;
  }
}

// Context
const GameContext = createContext(null);

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Ref to store previous character state for change detection
  const prevCharacterRef = useRef(null);

  // Helper to add notifications
  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    dispatch({ 
      type: ActionTypes.ADD_NOTIFICATION, 
      payload: { id, message, type } 
    });
    
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
      }, duration);
    }
    
    return id;
  }, []);

  // Load game
  const loadGame = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      await api.loadGame();
      
      // Fetch initial data
      const [entry, character, characterSheet, gameState] = await Promise.all([
        api.getCurrentEntry(),
        api.getCharacter(),
        api.getCharacterSheet(),
        api.getGameState(),
      ]);
      
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER_SHEET, payload: characterSheet });
      dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
      dispatch({ type: ActionTypes.GAME_LOADED });
      
      // Initialize character reference for change detection
      prevCharacterRef.current = character;
      
      addNotification('Partida cargada correctamente', 'success');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      addNotification(`Error: ${error.message}`, 'error');
    }
  }, [addNotification]);

  // Save game
  const saveGame = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      await api.saveGame();
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      addNotification('Partida guardada', 'success');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      addNotification(`Error al guardar: ${error.message}`, 'error');
    }
  }, [addNotification]);

  // Select an option
  const selectOption = useCallback(async (optionId) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    // Store previous character state for change detection
    const prevCharacter = prevCharacterRef.current;
    
    try {
      const result = await api.selectOption(optionId);
      dispatch({ type: ActionTypes.SET_OPTION_RESULT, payload: result });
      
      // Detectar si es un combate: tiene enemies, player y state
      const isCombatResult = result.enemies && result.player && result.state;
      
      // Handle different result types
      if (result.type === 'combat_started' || isCombatResult) {
        // El combate se inició
        if (isCombatResult) {
          dispatch({ type: ActionTypes.ENTER_COMBAT, payload: result });
          addNotification('⚔️ ¡Combate iniciado!', 'warning', 4000);
        } else {
          try {
            const combatStatus = await api.getCombatStatus();
            dispatch({ type: ActionTypes.ENTER_COMBAT, payload: combatStatus });
            addNotification('⚔️ ¡Combate iniciado!', 'warning', 4000);
          } catch (combatError) {
            addNotification('Error al iniciar combate', 'error');
          }
        }
      } else {
        // Fetch updated entry
        const entry = await api.getCurrentEntry();
        dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
        
        // Process effects from the entry if available
        if (result.effects) {
          processEntryEffects(result.effects, addNotification);
        }
        
        // Show result notification for skill checks and saves
        if (result.type === 'check_passed' || result.type === 'save_passed') {
          const icon = result.type === 'save_passed' ? '🛡️' : '✓';
          addNotification(`${icon} ¡Éxito! (${result.roll} vs CD ${result.dc})`, 'success', 4000);
        } else if (result.type === 'check_failed' || result.type === 'save_failed') {
          const icon = result.type === 'save_failed' ? '💥' : '✗';
          addNotification(`${icon} Fallaste (${result.roll} vs CD ${result.dc})`, 'error', 4000);
        }
      }
      
      // Update game state and character data (only if not in combat)
      const isCombat = result.type === 'combat_started' || (result.enemies && result.player && result.state);
      if (!isCombat) {
        // Fetch all updated data in parallel
        const [gameState, character, characterSheet] = await Promise.all([
          api.getGameState(),
          api.getCharacter(),
          api.getCharacterSheet(),
        ]);
        
        // Detect character changes and show notifications
        if (prevCharacter) {
          detectCharacterChanges(prevCharacter, character, addNotification);
        }
        
        // Update state
        dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
        dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
        dispatch({ type: ActionTypes.UPDATE_CHARACTER_SHEET, payload: characterSheet });
        
        // Store current character for next comparison
        prevCharacterRef.current = character;
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      addNotification(`Error: ${error.message}`, 'error');
      throw error;
    }
  }, [addNotification]);

  // Refresh character data
  const refreshCharacter = useCallback(async () => {
    try {
      const character = await api.getCharacter();
      dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
      prevCharacterRef.current = character;
    } catch (error) {
    }
  }, []);

  // Refresh character sheet data
  const refreshCharacterSheet = useCallback(async () => {
    try {
      const characterSheet = await api.getCharacterSheet();
      dispatch({ type: ActionTypes.UPDATE_CHARACTER_SHEET, payload: characterSheet });
    } catch (error) {
    }
  }, []);

  // Combat actions
  const attack = useCallback(async (targetIndex, weaponIndex = 0) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await api.playerAttack(targetIndex, weaponIndex);
      
      // El backend devuelve: { actions: [...], status: {...} }
      // actions contiene objetos con type: "PlayerHit", "PlayerMiss", "EnemyDefeated"
      const actions = response.actions || [response];
      const status = response.status;
      
      // Update combat state con el status si viene incluido
      if (status) {
        dispatch({ type: ActionTypes.UPDATE_COMBAT, payload: status });
      } else {
        // Fallback: pedir el status por separado
        const combatStatus = await api.getCombatStatus();
        dispatch({ type: ActionTypes.UPDATE_COMBAT, payload: combatStatus });
      }
      
      // Buscar acciones específicas (soportar snake_case y PascalCase)
      const hitAction = actions.find(a => a.type === 'player_hit' || a.type === 'PlayerHit');
      const missAction = actions.find(a => a.type === 'player_miss' || a.type === 'PlayerMiss');
      const defeatedAction = actions.find(a => a.type === 'enemy_defeated' || a.type === 'EnemyDefeated');
      const isVictory = status?.state === 'Victory';
      
      // Notificaciones para cada acción (soportar ambos formatos)
      actions.forEach(action => {
        const actionType = action.type?.toLowerCase();
        if (actionType === 'player_hit' || actionType === 'playerhit') {
          addNotification(`¡Golpe! ${action.damage} de daño`, 'success');
        } else if (actionType === 'player_miss' || actionType === 'playermiss') {
          addNotification(`¡Fallaste! (${action.roll})`, 'warning');
        } else if (actionType === 'enemy_defeated' || actionType === 'enemydefeated') {
          addNotification(`¡Enemigo derrotado!`, 'success');
        }
      });
      
      if (isVictory) {
        addNotification('¡Victoria! Todos los enemigos derrotados', 'success');
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      
      // Devolver el resultado completo para que CombatModal lo procese
      return response;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [addNotification]);

  const processEnemyTurn = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await api.enemyTurn();
      
      // El backend devuelve: { actions: [...], status: {...} }
      const actions = response.actions || (Array.isArray(response) ? response : [response]);
      const status = response.status;
      
      // Update combat state con el status si viene incluido
      if (status) {
        dispatch({ type: ActionTypes.UPDATE_COMBAT, payload: status });
      } else {
        // Fallback: pedir el status por separado
        const combatStatus = await api.getCombatStatus();
        dispatch({ type: ActionTypes.UPDATE_COMBAT, payload: combatStatus });
      }
      
      // Notificaciones para cada ataque enemigo (soportar snake_case y PascalCase)
      actions.forEach(action => {
        const actionType = action.type?.toLowerCase();
        if (actionType === 'enemy_hit' || actionType === 'enemyhit') {
          addNotification(`${action.actor || 'Enemigo'} te golpea por ${action.damage}`, 'error');
        } else if (actionType === 'enemy_miss' || actionType === 'enemymiss') {
          addNotification(`${action.actor || 'Enemigo'} falla su ataque`, 'info');
        } else if (actionType === 'player_defeated' || actionType === 'playerdefeated') {
          addNotification('¡Has sido derrotado!', 'error', 5000);
        }
      });
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      
      // Devolver la respuesta completa para que CombatModal la procese
      return response;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [addNotification]);

  const finishCombat = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      // endCombat devuelve el nuevo game state
      const result = await api.endCombat();
      dispatch({ type: ActionTypes.EXIT_COMBAT });
      
      // result contiene currentEntry, history, player
      if (result) {
        dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: result });
      }
      
      // Fetch all updated data after combat
      const [entry, character, characterSheet] = await Promise.all([
        api.getCurrentEntry(),
        api.getCharacter(),
        api.getCharacterSheet(),
      ]);
      
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER_SHEET, payload: characterSheet });
      
      // Update character reference
      prevCharacterRef.current = character;
      
      // Process effects from combat victory entry if available
      if (entry.effects) {
        processEntryEffects(entry.effects, addNotification);
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      addNotification('🏆 Combate terminado', 'info');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [addNotification]);

  // Roll dice (utility)
  const rollDice = useCallback(async (diceType, count, bonus = 0) => {
    try {
      const result = await api.rollDice(diceType, count, bonus);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  // Reset game to initial state
  const resetGame = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      await api.resetGame();
      dispatch({ type: ActionTypes.RESET_GAME });
      
      // Reload game after reset
      await api.loadGame();
      
      const [entry, character, characterSheet, gameState] = await Promise.all([
        api.getCurrentEntry(),
        api.getCharacter(),
        api.getCharacterSheet(),
        api.getGameState(),
      ]);
      
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER_SHEET, payload: characterSheet });
      dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
      dispatch({ type: ActionTypes.GAME_LOADED });
      
      addNotification('Juego reiniciado', 'success');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      addNotification(`Error al reiniciar: ${error.message}`, 'error');
    }
  }, [addNotification]);

  const value = {
    // State
    ...state,
    
    // Actions
    loadGame,
    saveGame,
    selectOption,
    refreshCharacter,
    refreshCharacterSheet,
    attack,
    processEnemyTurn,
    finishCombat,
    rollDice,
    resetGame,
    addNotification,
    
    // Helpers
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    removeNotification: (id) => dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id }),
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hook for consuming context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
