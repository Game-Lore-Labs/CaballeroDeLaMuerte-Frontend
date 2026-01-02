// ============================================================================
// src/components/character/CharacterSheet.jsx - Full Character Sheet
// ============================================================================

import React from 'react';
import { 
  Panel, 
  StatBar,
  AttributesIcon,
  SkillsIcon,
  ShieldIcon,
  SwordIcon,
  getItemIcon,
  MiscItemIcon,
} from '../ui';
import { 
  formatModifier,
} from '../../utils/constants';
import './CharacterSheet.css';

// Función para obtener la ruta del icono basándose en el ID del item
// Intenta cargar directamente /Icons/{id}.png
const getItemIconPath = (itemId) => {
  if (!itemId) return null;
  return `/Icons/${itemId}.png`;
};

// Mapeo de claves de atributos del backend a abreviaturas en español
const ATTR_KEY_TO_ABBR = {
  strength: 'FUE',
  dexterity: 'DES',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'SAB',
  charisma: 'CAR',
};

// Orden de atributos para mostrar
const ATTRIBUTE_ORDER = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

// Attribute display component - ahora recibe los datos directamente del backend
const AttributeBox = ({ attrKey, attrData }) => {
  const { score, modifier, name } = attrData;
  const abbr = ATTR_KEY_TO_ABBR[attrKey];
  
  return (
    <div className="attribute-box">
      <span className="attribute-box__abbr">{abbr}</span>
      <span className="attribute-box__score">{score}</span>
      <span className={`attribute-box__modifier ${modifier >= 0 ? 'positive' : 'negative'}`}>
        {formatModifier(modifier)}
      </span>
      <span className="attribute-box__name">{name}</span>
    </div>
  );
};

// Skill list component - ahora usa los datos de skills directamente del backend
const SkillList = ({ skills = {}, proficiencyBonus = 2 }) => {
  // Convertir el objeto de skills a array ordenado por nombre
  const skillEntries = Object.entries(skills)
    .map(([key, skillData]) => ({
      key,
      name: skillData.name,
      bonus: skillData.bonus,
      // Determinar proficiencia basado en si el bonus es mayor que el modificador base
      // Asumimos que si bonus >= proficiencyBonus, tiene proficiencia
      proficient: skillData.proficient || false,
      expertise: skillData.expertise || false,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return (
    <div className="skill-list">
      {skillEntries.map(({ key, name, bonus, proficient, expertise }) => (
        <div 
          key={key} 
          className={`skill-row ${proficient ? 'skill-row--proficient' : ''} ${expertise ? 'skill-row--expertise' : ''}`}
        >
          <span className="skill-row__prof">
            {expertise ? '◆' : proficient ? '●' : '○'}
          </span>
          <span className="skill-row__name">{name}</span>
          <span className={`skill-row__bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
            {formatModifier(bonus)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Combat stats component
const CombatStats = ({ ac, speed, profBonus, initiative }) => (
  <div className="combat-stats">
    <div className="combat-stat">
      <span className="combat-stat__value">{ac}</span>
      <span className="combat-stat__label">CA</span>
    </div>
    <div className="combat-stat">
      <span className="combat-stat__value">{speed || 30}</span>
      <span className="combat-stat__label">Velocidad</span>
    </div>
    <div className="combat-stat">
      <span className="combat-stat__value">+{profBonus || 2}</span>
      <span className="combat-stat__label">Competencia</span>
    </div>
    <div className="combat-stat">
      <span className="combat-stat__value">{formatModifier(initiative || 0)}</span>
      <span className="combat-stat__label">Iniciativa</span>
    </div>
  </div>
);

// Main CharacterSheet component
const CharacterSheet = ({ characterSheet }) => {
  if (!characterSheet) {
    return (
      <div className="character-sheet character-sheet--empty">
        <Panel variant="dark" title="Personaje" icon={<ShieldIcon size={20} />}>
          <p className="empty-message">No hay personaje cargado</p>
        </Panel>
      </div>
    );
  }

  // Extract character data from the new /character/sheet endpoint format
  const {
    attributes = {},
    basicInfo = {},
    combatStats = {},
    skills = {},
    equipment = [],
    inventory = [],
    clues = [],
  } = characterSheet;

  // Extraer datos de combate
  const {
    currentHP = 14,
    maxHP = 14,
    armorClass: ac = 15,
    speed = 30,
    proficiencyBonus: profBonus = 2,
    initiative = 0,
  } = combatStats;

  // Extraer info básica
  const {
    class: characterClass = 'Aventurero',
    level = 1,
    race = '',
    background = '',
  } = basicInfo;

  return (
    <div className="character-sheet">
      {/* Header with portrait and basic info */}
      <div className="character-sheet__header">
        <Panel variant="gold" className="character-portrait-panel">
          <div className="character-portrait">
            <div className="character-portrait__frame character-portrait__frame--video">
              <div className="character-portrait__video-container">
                <video 
                  className="character-portrait__video"
                  src="/video/iksapen.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
            <div className="character-portrait__info">
              <h2 className="character-portrait__name">Iksa Pen</h2>
              <p className="character-portrait__class">{characterClass} • Nivel {level}</p>
            </div>
          </div>
        </Panel>

        {/* HP and combat stats */}
        <Panel variant="dark" className="character-vitals-panel">
          <div className="character-vitals">
            <div className="character-vitals__hp">
              <StatBar
                current={currentHP}
                max={maxHP}
                label="Puntos de Vida"
                variant="health"
                size="large"
              />
            </div>
            <CombatStats ac={ac} speed={speed} profBonus={profBonus} initiative={initiative} />
          </div>
        </Panel>
      </div>

      {/* Main content - two columns */}
      <div className="character-sheet__body">
        {/* Left column - Attributes */}
        <Panel variant="dark" title="Atributos" icon={<AttributesIcon size={20} />} className="attributes-panel">
          <div className="attributes-grid">
            {ATTRIBUTE_ORDER.map((attrKey) => {
              const attrData = attributes[attrKey];
              return attrData ? (
                <AttributeBox key={attrKey} attrKey={attrKey} attrData={attrData} />
              ) : null;
            })}
          </div>
        </Panel>

        {/* Right column - Skills */}
        <Panel variant="dark" title="Habilidades" icon={<SkillsIcon size={20} />} className="skills-panel">
          <div className="skills-container">
            <SkillList skills={skills} proficiencyBonus={profBonus} />
          </div>
        </Panel>
      </div>

      {/* Saving throws */}
      <Panel variant="dark" title="Tiradas de Salvación" icon={<ShieldIcon size={20} />} className="saves-panel">
        <div className="saves-grid">
          {ATTRIBUTE_ORDER.map((attrKey) => {
            const attrData = attributes[attrKey];
            if (!attrData) return null;
            
            const { savingThrow, modifier, name } = attrData;
            const isProficient = savingThrow > modifier;
            const abbr = ATTR_KEY_TO_ABBR[attrKey];
            
            return (
              <div key={attrKey} className={`save-item ${isProficient ? 'save-item--proficient' : ''}`}>
                <span className="save-item__prof">{isProficient ? '●' : '○'}</span>
                <span className="save-item__name">{abbr}</span>
                <span className={`save-item__bonus ${savingThrow >= 0 ? 'positive' : 'negative'}`}>
                  {formatModifier(savingThrow)}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Equipment section */}
      {equipment.length > 0 && (
        <Panel variant="dark" title="Equipamiento" icon={<SwordIcon size={20} />} className="equipment-panel">
          <div className="equipment-list">
            {equipment.map((item, idx) => {
              const iconPath = getItemIconPath(item.id);
              const FallbackIcon = getItemIcon(item.name) || MiscItemIcon;
              return (
                <div key={idx} className="equipment-item">
                  <span className="equipment-item__icon">
                    <img 
                      src={iconPath} 
                      alt={item.name} 
                      className="equipment-item__img"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <span className="equipment-item__fallback-icon" style={{ display: 'none' }}>
                      <FallbackIcon size={24} />
                    </span>
                  </span>
                  <div className="equipment-item__info">
                    <span className="equipment-item__name">{item.name}</span>
                    <span className="equipment-item__desc">{item.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
};

export default CharacterSheet;
