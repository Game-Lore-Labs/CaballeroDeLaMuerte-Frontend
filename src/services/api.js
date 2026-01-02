// ============================================================================
// src/services/api.js - API Service for RPG Bot Backend
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Generic API request handler with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Unknown API error');
    }

    return data.payload;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================================================
// Game Management
// ============================================================================

/**
 * Health check endpoint
 */
export async function healthCheck() {
  return apiRequest('/health');
}

/**
 * Load the game state from the server
 */
export async function loadGame() {
  return apiRequest('/game/load', { method: 'POST' });
}

/**
 * Save the current game state
 */
export async function saveGame() {
  return apiRequest('/game/save', { method: 'POST' });
}

/**
 * Get the current game state
 */
export async function getGameState() {
  return apiRequest('/game/state');
}

// ============================================================================
// Entry / Adventure Navigation
// ============================================================================

/**
 * Get the current entry with narrative and options
 */
export async function getCurrentEntry() {
  return apiRequest('/entry/current');
}

/**
 * Select an option from the current entry
 * @param {number} optionId - The ID of the option to select
 */
export async function selectOption(optionId) {
  return apiRequest('/entry/select', {
    method: 'POST',
    body: JSON.stringify({ selectOptionId: optionId }),
  });
}

// ============================================================================
// Character Operations
// ============================================================================

/**
 * Get player character information
 */
export async function getCharacter() {
  return apiRequest('/character');
}

/**
 * Get full character sheet with attributes, skills, equipment, etc.
 */
export async function getCharacterSheet() {
  return apiRequest('/character/sheet');
}

/**
 * Get player inventory
 */
export async function getInventory() {
  return apiRequest('/character/inventory');
}

/**
 * Get discovered clues
 */
export async function getClues() {
  return apiRequest('/character/clues');
}

/**
 * Perform an ability check (skill check)
 * @param {string} skill - The skill to check
 * @param {number} dc - Difficulty class
 */
export async function performAbilityCheck(skill, dc) {
  return apiRequest('/character/check', {
    method: 'POST',
    body: JSON.stringify({ checkSkill: skill, checkDC: dc }),
  });
}

/**
 * Perform a saving throw
 * @param {string} attribute - The attribute for the save
 * @param {number} dc - Difficulty class
 */
export async function performSavingThrow(attribute, dc) {
  return apiRequest('/character/save', {
    method: 'POST',
    body: JSON.stringify({ saveAttribute: attribute, saveDC: dc }),
  });
}

// ============================================================================
// Combat Operations
// ============================================================================

/**
 * Get current combat status
 */
export async function getCombatStatus() {
  return apiRequest('/combat/status');
}

/**
 * Player attacks an enemy
 * @param {number} targetIndex - Index of the target enemy
 * @param {number} weaponIndex - Index of the weapon to use
 */
export async function playerAttack(targetIndex, weaponIndex = 0) {
  return apiRequest('/combat/attack', {
    method: 'POST',
    body: JSON.stringify({ 
      attackTargetIndex: targetIndex, 
      attackWeaponIndex: weaponIndex 
    }),
  });
}

/**
 * Process enemy turn (all enemies attack)
 */
export async function enemyTurn() {
  return apiRequest('/combat/enemy-turn', { method: 'POST' });
}

/**
 * End combat and return to adventure
 */
export async function endCombat() {
  return apiRequest('/combat/end', { method: 'POST' });
}

// ============================================================================
// Dice Rolling
// ============================================================================

/**
 * Roll dice
 * @param {string} diceType - Type of dice (D4, D6, D8, D10, D12, D20, D100)
 * @param {number} count - Number of dice to roll
 * @param {number} bonus - Flat bonus to add
 */
export async function rollDice(diceType, count, bonus = 0) {
  return apiRequest('/dice/roll', {
    method: 'POST',
    body: JSON.stringify({
      rollDiceType: diceType,
      rollDiceCount: count,
      rollDiceBonus: bonus,
    }),
  });
}

// ============================================================================
// Type Definitions (for reference)
// ============================================================================

/**
 * @typedef {Object} CharacterDTO
 * @property {number} currentHP
 * @property {number} maxHP
 * @property {number} ac
 * @property {ItemDTO[]} inventory
 * @property {ItemDTO[]} equipment
 * @property {string[]} clues
 */

/**
 * @typedef {Object} ItemDTO
 * @property {string} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} EntryDTO
 * @property {number} id
 * @property {string} narrative
 * @property {OptionDTO[]} options
 */

/**
 * @typedef {Object} OptionDTO
 * @property {number} id
 * @property {string} description
 */

/**
 * @typedef {Object} OptionResultDTO
 * @property {string} type - navigated|check_passed|check_failed|save_passed|save_failed|combat_started|error
 * @property {number|null} roll
 * @property {number|null} dc
 * @property {number|null} destination
 * @property {string|null} skill
 * @property {string|null} attribute
 */

/**
 * @typedef {Object} GameStateDTO
 * @property {number} currentEntry
 * @property {CharacterDTO} player
 * @property {number[]} history
 */

/**
 * @typedef {Object} CombatStatusDTO
 * @property {string} state - InProgress|Victory|Defeat
 * @property {CharacterDTO} player
 * @property {EnemyDTO[]} enemies
 */

/**
 * @typedef {Object} EnemyDTO
 * @property {string} name
 * @property {number} currentHP
 * @property {number} maxHP
 * @property {number} ac
 */

/**
 * @typedef {Object} CheckResultDTO
 * @property {string} skill
 * @property {number} roll
 * @property {number} bonus
 * @property {number} total
 * @property {number} dc
 * @property {boolean} success
 */

/**
 * @typedef {Object} DiceRollDTO
 * @property {number[]} values
 * @property {number} bonus
 * @property {number} total
 */

// Export all as default object for convenience
const api = {
  healthCheck,
  loadGame,
  saveGame,
  getGameState,
  getCurrentEntry,
  selectOption,
  getCharacter,
  getCharacterSheet,
  getInventory,
  getClues,
  performAbilityCheck,
  performSavingThrow,
  getCombatStatus,
  playerAttack,
  enemyTurn,
  endCombat,
  rollDice,
};

export default api;
