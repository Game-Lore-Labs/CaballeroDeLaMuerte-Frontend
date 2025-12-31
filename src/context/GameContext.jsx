// ============================================================================
// src/context/GameContext.jsx - Game State Context Provider
// ============================================================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../services/api';

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
      return {
        ...state,
        combatState: action.payload,
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
      const [entry, character, gameState] = await Promise.all([
        api.getCurrentEntry(),
        api.getCharacter(),
        api.getGameState(),
      ]);
      
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
      dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
      dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
      dispatch({ type: ActionTypes.GAME_LOADED });
      
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
    
    try {
      const result = await api.selectOption(optionId);
      dispatch({ type: ActionTypes.SET_OPTION_RESULT, payload: result });
      
      // Handle different result types
      if (result.type === 'combat_started') {
        const combatStatus = await api.getCombatStatus();
        dispatch({ type: ActionTypes.ENTER_COMBAT, payload: combatStatus });
        addNotification('¡Combate iniciado!', 'warning');
      } else {
        // Fetch updated entry
        const entry = await api.getCurrentEntry();
        dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
        
        // Show result notification
        if (result.type === 'check_passed' || result.type === 'save_passed') {
          addNotification(`¡Éxito! (${result.roll} vs DC ${result.dc})`, 'success');
        } else if (result.type === 'check_failed' || result.type === 'save_failed') {
          addNotification(`Fallaste (${result.roll} vs DC ${result.dc})`, 'error');
        }
      }
      
      // Update game state
      const gameState = await api.getGameState();
      dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
      
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
    } catch (error) {
      console.error('Error refreshing character:', error);
    }
  }, []);

  // Combat actions
  const attack = useCallback(async (targetIndex, weaponIndex = 0) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const result = await api.playerAttack(targetIndex, weaponIndex);
      
      // Update combat state
      const combatStatus = await api.getCombatStatus();
      dispatch({ type: ActionTypes.UPDATE_COMBAT, payload: combatStatus });
      
      // Notification
      if (result.type === 'player_hit') {
        addNotification(`¡Golpe! ${result.damage} de daño`, 'success');
      } else if (result.type === 'player_miss') {
        addNotification(`¡Fallaste! (${result.roll})`, 'warning');
      } else if (result.type === 'enemy_defeated') {
        addNotification(`¡${result.actor} derrotado!`, 'success');
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [addNotification]);

  const processEnemyTurn = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const results = await api.enemyTurn();
      
      // Update combat state
      const combatStatus = await api.getCombatStatus();
      dispatch({ type: ActionTypes.UPDATE_COMBAT, payload: combatStatus });
      
      // Notifications for each attack
      results.forEach(result => {
        if (result.type === 'enemy_hit') {
          addNotification(`${result.actor} te golpea por ${result.damage}`, 'error');
        } else if (result.type === 'enemy_miss') {
          addNotification(`${result.actor} falla su ataque`, 'info');
        } else if (result.type === 'player_defeated') {
          addNotification('¡Has sido derrotado!', 'error', 5000);
        }
      });
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return results;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [addNotification]);

  const finishCombat = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const gameState = await api.endCombat();
      dispatch({ type: ActionTypes.EXIT_COMBAT });
      dispatch({ type: ActionTypes.UPDATE_GAME_STATE, payload: gameState });
      
      // Get new entry
      const entry = await api.getCurrentEntry();
      dispatch({ type: ActionTypes.UPDATE_ENTRY, payload: entry });
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      addNotification('Combate terminado', 'info');
    } catch (error) {
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
      console.error('Dice roll error:', error);
      throw error;
    }
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_GAME });
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    loadGame,
    saveGame,
    selectOption,
    refreshCharacter,
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
