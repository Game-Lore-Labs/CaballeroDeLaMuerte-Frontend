// ============================================================================
// src/utils/effectsProcessor.js - Process entry effects and generate notifications
// ============================================================================

/**
 * Process effects from an entry and generate appropriate notifications
 * @param {Object} effects - The effects object from the entry
 * @param {Function} addNotification - Function to add notifications
 * @returns {Object} - Summary of processed effects
 */
export function processEntryEffects(effects, addNotification) {
  if (!effects) return { hasChanges: false };

  const summary = {
    hasChanges: false,
    statsChanged: [],
    equipmentGained: [],
    inventoryGained: [],
    inventoryLost: [],
    attributesChanged: [],
    skillsChanged: [],
  };

  // Process stat changes (HP, AC, etc.)
  if (effects.stats && effects.stats.length > 0) {
    effects.stats.forEach(stat => {
      summary.hasChanges = true;
      summary.statsChanged.push(stat);
      
      const statName = getStatDisplayName(stat.name);
      const modifier = stat.modifier;
      
      if (typeof modifier === 'string' && modifier.includes('d')) {
        // Dice roll modifier like "-1d6"
        if (modifier.startsWith('-')) {
          addNotification(`${statName}: ${modifier} de daño`, 'error', 4000);
        } else {
          addNotification(`${statName}: +${modifier}`, 'success', 4000);
        }
      } else if (typeof modifier === 'number') {
        if (modifier > 0) {
          addNotification(`${statName} +${modifier}`, 'success', 4000);
        } else if (modifier < 0) {
          addNotification(`${statName} ${modifier}`, 'error', 4000);
        }
      }
    });
  }

  // Process equipment gained
  if (effects.equipment && effects.equipment.length > 0) {
    effects.equipment.forEach(item => {
      summary.hasChanges = true;
      summary.equipmentGained.push(item);
      
      const quantity = item.quantity > 1 ? ` x${item.quantity}` : '';
      const bonus = item.bonus ? ` (${item.bonus})` : '';
      addNotification(`🎒 ¡Nuevo equipo: ${item.name}${quantity}${bonus}!`, 'success', 5000);
    });
  }

  // Process inventory changes
  if (effects.inventory && effects.inventory.length > 0) {
    effects.inventory.forEach(item => {
      summary.hasChanges = true;
      
      const quantity = item.quantity || 1;
      
      if (quantity < 0) {
        // Lost item
        summary.inventoryLost.push(item);
        addNotification(`📦 Perdiste: ${item.name}`, 'warning', 4000);
      } else {
        // Gained item
        summary.inventoryGained.push(item);
        
        const icon = getItemIcon(item.type);
        const quantityText = quantity > 1 ? ` x${quantity}` : '';
        const valueText = item.value ? ` (${item.value} po)` : '';
        
        if (item.type === 'currency') {
          addNotification(`${icon} +${quantity} ${item.name}`, 'success', 4000);
        } else if (item.type === 'information') {
          addNotification(`📜 Nueva pista: ${item.name}`, 'info', 5000);
        } else {
          addNotification(`${icon} ¡Obtenido: ${item.name}${quantityText}${valueText}!`, 'success', 4000);
        }
      }
    });
  }

  // Process attribute changes (saving throw bonuses, etc.)
  if (effects.attributes && effects.attributes.length > 0) {
    let hasSaveBonus = false;
    effects.attributes.forEach(attr => {
      summary.hasChanges = true;
      summary.attributesChanged.push(attr);
      
      if (attr.savingThrow) {
        hasSaveBonus = true;
      }
    });
    
    if (hasSaveBonus) {
      addNotification('✨ Bonificación a tiradas de salvación', 'success', 4000);
    }
  }

  // Process skill changes
  if (effects.skills && effects.skills.length > 0) {
    effects.skills.forEach(skill => {
      summary.hasChanges = true;
      summary.skillsChanged.push(skill);
      
      const skillName = getSkillDisplayName(skill.name);
      if (skill.modifier > 0) {
        addNotification(`📈 ${skillName} +${skill.modifier}`, 'success', 4000);
      }
    });
  }

  return summary;
}

/**
 * Get display name for stats
 */
function getStatDisplayName(statName) {
  const names = {
    currentHP: 'Puntos de Vida',
    maxHP: 'Vida Máxima',
    armorClass: 'Clase de Armadura',
    initiative: 'Iniciativa',
    speed: 'Velocidad',
    proficiencyBonus: 'Bonificador de Competencia',
  };
  return names[statName] || statName;
}

/**
 * Get display name for skills
 */
function getSkillDisplayName(skillName) {
  const names = {
    Athletics: 'Atletismo',
    Acrobatics: 'Acrobacias',
    SleightOfHand: 'Juego de Manos',
    Stealth: 'Sigilo',
    Arcana: 'Arcano',
    History: 'Historia',
    Investigation: 'Investigación',
    Nature: 'Naturaleza',
    Religion: 'Religión',
    AnimalHandling: 'Trato con Animales',
    Insight: 'Perspicacia',
    Medicine: 'Medicina',
    Perception: 'Percepción',
    Survival: 'Supervivencia',
    Deception: 'Engaño',
    Intimidation: 'Intimidación',
    Performance: 'Interpretación',
    Persuasion: 'Persuasión',
  };
  return names[skillName] || skillName;
}

/**
 * Get icon for item type
 */
function getItemIcon(itemType) {
  const icons = {
    currency: '💰',
    weapon: '⚔️',
    armor: '🛡️',
    potion: '🧪',
    scroll: '📜',
    information: '📋',
    jewelry: '💍',
    treasure: '💎',
    wondrous: '✨',
    holy_symbol: '☀️',
    special_weapon: '🗡️',
    consumable: '🍖',
    ammunition: '🏹',
    ring: '💍',
    tool: '🔧',
  };
  return icons[itemType] || '📦';
}

/**
 * Compare two character states and detect changes
 * @param {Object} oldChar - Previous character state
 * @param {Object} newChar - New character state
 * @param {Function} addNotification - Function to add notifications
 */
export function detectCharacterChanges(oldChar, newChar, addNotification) {
  if (!oldChar || !newChar) return;

  // Check HP changes
  if (oldChar.currentHP !== newChar.currentHP) {
    const diff = newChar.currentHP - oldChar.currentHP;
    if (diff < 0) {
      addNotification(`❤️ ${diff} PV`, 'error', 3000);
    } else if (diff > 0) {
      addNotification(`❤️ +${diff} PV`, 'success', 3000);
    }
  }

  // Check inventory changes
  const oldInvCount = oldChar.inventory?.length || 0;
  const newInvCount = newChar.inventory?.length || 0;
  
  if (newInvCount > oldInvCount) {
    // New items - will be handled by processEntryEffects
  }

  // Check clues changes
  const oldCluesCount = oldChar.clues?.length || 0;
  const newCluesCount = newChar.clues?.length || 0;
  
  if (newCluesCount > oldCluesCount) {
    addNotification('🔍 ¡Nueva pista descubierta!', 'info', 4000);
  }
}

/**
 * Format result message based on result type
 */
export function formatResultMessage(result) {
  if (!result) return null;

  switch (result.type) {
    case 'check_passed':
      return {
        type: 'success',
        title: '¡Éxito!',
        message: `Tirada: ${result.roll} vs CD ${result.dc}`,
        icon: '✓',
      };
    
    case 'check_failed':
      return {
        type: 'error',
        title: 'Fallaste',
        message: `Tirada: ${result.roll} vs CD ${result.dc}`,
        icon: '✗',
      };
    
    case 'save_passed':
      return {
        type: 'success',
        title: '¡Salvación exitosa!',
        message: `Tirada: ${result.roll} vs CD ${result.dc}`,
        icon: '🛡️',
      };
    
    case 'save_failed':
      return {
        type: 'error',
        title: 'Salvación fallida',
        message: `Tirada: ${result.roll} vs CD ${result.dc}`,
        icon: '💥',
      };
    
    case 'navigated':
      return null; // No message needed for simple navigation
    
    case 'combat_started':
      return {
        type: 'warning',
        title: '¡Combate!',
        message: '¡Prepárate para la batalla!',
        icon: '⚔️',
      };
    
    default:
      return null;
  }
}

const effectsProcessor = {
  processEntryEffects,
  detectCharacterChanges,
  formatResultMessage,
};

export default effectsProcessor;
