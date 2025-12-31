// ============================================================================
// src/utils/constants.js - Game Constants and Utilities
// ============================================================================

// D&D 5e Skills mapped to their governing attributes
export const SKILLS = {
  Athletics: 'Strength',
  Acrobatics: 'Dexterity',
  SleightOfHand: 'Dexterity',
  Stealth: 'Dexterity',
  Arcana: 'Intelligence',
  History: 'Intelligence',
  Investigation: 'Intelligence',
  Nature: 'Intelligence',
  Religion: 'Intelligence',
  AnimalHandling: 'Wisdom',
  Insight: 'Wisdom',
  Medicine: 'Wisdom',
  Perception: 'Wisdom',
  Survival: 'Wisdom',
  Deception: 'Charisma',
  Intimidation: 'Charisma',
  Performance: 'Charisma',
  Persuasion: 'Charisma',
};

// Skill display names in Spanish
export const SKILL_NAMES_ES = {
  Athletics: 'Atletismo',
  Acrobatics: 'Acrobacias',
  SleightOfHand: 'Juego de Manos',
  Stealth: 'Sigilo',
  Arcana: 'Arcana',
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
  Performance: 'Actuación',
  Persuasion: 'Persuasión',
};

// Attributes
export const ATTRIBUTES = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
];

// Attribute display names in Spanish
export const ATTRIBUTE_NAMES_ES = {
  Strength: 'Fuerza',
  Dexterity: 'Destreza',
  Constitution: 'Constitución',
  Intelligence: 'Inteligencia',
  Wisdom: 'Sabiduría',
  Charisma: 'Carisma',
};

// Attribute abbreviations
export const ATTRIBUTE_ABBR = {
  Strength: 'FUE',
  Dexterity: 'DES',
  Constitution: 'CON',
  Intelligence: 'INT',
  Wisdom: 'SAB',
  Charisma: 'CAR',
};

// Dice types
export const DICE_TYPES = ['D2', 'D4', 'D6', 'D8', 'D10', 'D12', 'D20', 'D100'];

// Damage types
export const DAMAGE_TYPES = {
  Piercing: { name: 'Perforante', icon: '🗡️' },
  Slashing: { name: 'Cortante', icon: '⚔️' },
  Bludgeoning: { name: 'Contundente', icon: '🔨' },
  Fire: { name: 'Fuego', icon: '🔥' },
  Cold: { name: 'Frío', icon: '❄️' },
  Lightning: { name: 'Rayo', icon: '⚡' },
  Poison: { name: 'Veneno', icon: '☠️' },
  Necrotic: { name: 'Necrótico', icon: '💀' },
  Radiant: { name: 'Radiante', icon: '✨' },
};

// Item type icons
export const ITEM_ICONS = {
  weapon: '⚔️',
  armor: '🛡️',
  potion: '🧪',
  scroll: '📜',
  key: '🔑',
  treasure: '💎',
  tool: '🔧',
  food: '🍖',
  misc: '📦',
};

// Result type messages
export const RESULT_MESSAGES = {
  navigated: 'Avanzas...',
  check_passed: '¡Éxito en la prueba!',
  check_failed: 'Fallaste la prueba...',
  save_passed: '¡Salvación exitosa!',
  save_failed: 'No pudiste resistir...',
  combat_started: '¡Combate!',
  error: 'Algo salió mal...',
};

// Combat states
export const COMBAT_STATES = {
  InProgress: 'En progreso',
  Victory: '¡Victoria!',
  Defeat: 'Derrota',
};

// Calculate attribute modifier
export function getAttributeModifier(score) {
  return Math.floor((score - 10) / 2);
}

// Format modifier as string (+X or -X)
export function formatModifier(modifier) {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Get health percentage
export function getHealthPercentage(current, max) {
  return Math.max(0, Math.min(100, (current / max) * 100));
}

// Get health status based on percentage
export function getHealthStatus(current, max) {
  const percentage = getHealthPercentage(current, max);
  if (percentage > 60) return 'healthy';
  if (percentage > 30) return 'wounded';
  return 'critical';
}

// Format item description with type icon
export function formatItemWithIcon(item) {
  const icon = guessItemIcon(item.name);
  return { ...item, icon };
}

// Guess item type from name
export function guessItemIcon(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('espada') || lowerName.includes('daga') || lowerName.includes('sword') || lowerName.includes('weapon')) {
    return ITEM_ICONS.weapon;
  }
  if (lowerName.includes('armadura') || lowerName.includes('escudo') || lowerName.includes('armor') || lowerName.includes('shield')) {
    return ITEM_ICONS.armor;
  }
  if (lowerName.includes('poción') || lowerName.includes('potion') || lowerName.includes('elixir')) {
    return ITEM_ICONS.potion;
  }
  if (lowerName.includes('pergamino') || lowerName.includes('scroll') || lowerName.includes('libro')) {
    return ITEM_ICONS.scroll;
  }
  if (lowerName.includes('llave') || lowerName.includes('key')) {
    return ITEM_ICONS.key;
  }
  if (lowerName.includes('gema') || lowerName.includes('oro') || lowerName.includes('treasure') || lowerName.includes('gold')) {
    return ITEM_ICONS.treasure;
  }
  if (lowerName.includes('cuerda') || lowerName.includes('herramienta') || lowerName.includes('rope') || lowerName.includes('tool')) {
    return ITEM_ICONS.tool;
  }
  if (lowerName.includes('comida') || lowerName.includes('ración') || lowerName.includes('food') || lowerName.includes('ration')) {
    return ITEM_ICONS.food;
  }
  
  return ITEM_ICONS.misc;
}

// Class information
export const CHARACTER_CLASSES = {
  Fighter: {
    name: 'Guerrero',
    description: 'Maestro del combate con armas',
    icon: '⚔️',
    primaryAttribute: 'Strength',
  },
  Wizard: {
    name: 'Mago',
    description: 'Practicante de la magia arcana',
    icon: '🔮',
    primaryAttribute: 'Intelligence',
  },
  Rogue: {
    name: 'Pícaro',
    description: 'Experto en sigilo y artimañas',
    icon: '🗡️',
    primaryAttribute: 'Dexterity',
  },
  Cleric: {
    name: 'Clérigo',
    description: 'Canaliza el poder divino',
    icon: '✝️',
    primaryAttribute: 'Wisdom',
  },
  Paladin: {
    name: 'Paladín',
    description: 'Guerrero sagrado',
    icon: '🛡️',
    primaryAttribute: 'Charisma',
  },
};

// Iksa Pen - Default character reference
export const IKSA_PEN_STATS = {
  name: 'Iksa Pen',
  class: 'Rogue',
  hp: 14,
  maxHp: 14,
  ac: 15,
  proficiencyBonus: 2,
  attributes: {
    Strength: 9,
    Dexterity: 16,
    Constitution: 12,
    Intelligence: 16,
    Wisdom: 12,
    Charisma: 12,
  },
  savingThrowProficiencies: ['Dexterity', 'Intelligence'],
  skillExpertise: ['Investigation', 'Stealth'],
};
