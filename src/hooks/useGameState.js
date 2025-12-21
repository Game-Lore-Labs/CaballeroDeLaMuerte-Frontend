// ============================================================================
// src/hooks/useGameState.js
// ============================================================================

import { useState, useCallback } from 'react';
import apiService from '../services/api';

export const useGameState = () => {
  const [gameState, setGameState] = useState(null);
  const [narrative, setNarrative] = useState('');
  const [options, setOptions] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateFromResponse = useCallback((response) => {
    setGameState(response.gameState);
    setNarrative(response.currentNarrative);
    setOptions(response.availableOptions || []);
    setIsGameOver(response.isGameOver);
  }, []);

  const createCharacter = useCallback(async (name, charClass) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createCharacter(name, charClass);
      updateFromResponse(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateFromResponse]);

  const makeChoice = useCallback(async (choiceIndex) => {
    if (!gameState) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.makeChoice(choiceIndex, gameState);
      updateFromResponse(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gameState, updateFromResponse]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setNarrative('');
    setOptions([]);
    setIsGameOver(false);
    setError(null);
  }, []);

  return {
    gameState,
    narrative,
    options,
    isGameOver,
    loading,
    error,
    createCharacter,
    makeChoice,
    resetGame,
  };
};