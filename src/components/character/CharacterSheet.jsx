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
} from '../ui';
import { 
  ATTRIBUTE_NAMES_ES, 
  ATTRIBUTE_ABBR, 
  getAttributeModifier, 
  formatModifier,
  SKILL_NAMES_ES,
  SKILLS,
} from '../../utils/constants';
import './CharacterSheet.css';

// Attribute display component
const AttributeBox = ({ attribute, score }) => {
  const modifier = getAttributeModifier(score);
  const abbr = ATTRIBUTE_ABBR[attribute];
  const name = ATTRIBUTE_NAMES_ES[attribute];
  
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

// Skill list component
const SkillList = ({ skills = {}, attributes = {} }) => {
  const skillEntries = Object.keys(SKILLS).map(skill => {
    const attr = SKILLS[skill];
    const attrScore = attributes[attr] || 10;
    const modifier = getAttributeModifier(attrScore);
    const profLevel = skills[skill] || 'NotProficient';
    
    let bonus = modifier;
    if (profLevel === 'Proficient') bonus += 2;
    if (profLevel === 'Expertise') bonus += 4;
    
    return {
      skill,
      name: SKILL_NAMES_ES[skill],
      attr: ATTRIBUTE_ABBR[attr],
      bonus,
      proficient: profLevel !== 'NotProficient',
      expertise: profLevel === 'Expertise',
    };
  });

  return (
    <div className="skill-list">
      {skillEntries.map(({ skill, name, attr, bonus, proficient, expertise }) => (
        <div 
          key={skill} 
          className={`skill-row ${proficient ? 'skill-row--proficient' : ''} ${expertise ? 'skill-row--expertise' : ''}`}
        >
          <span className="skill-row__prof">
            {expertise ? '◆' : proficient ? '●' : '○'}
          </span>
          <span className="skill-row__name">{name}</span>
          <span className="skill-row__attr">({attr})</span>
          <span className={`skill-row__bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
            {formatModifier(bonus)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Combat stats component
const CombatStats = ({ ac, speed, profBonus }) => (
  <div className="combat-stats">
    <div className="combat-stat">
      <span className="combat-stat__value">{ac}</span>
      <span className="combat-stat__label">CA</span>
    </div>
    <div className="combat-stat">
      <span className="combat-stat__value">{speed || 0}</span>
      <span className="combat-stat__label">Velocidad</span>
    </div>
    <div className="combat-stat">
      <span className="combat-stat__value">+{profBonus || 0}</span>
      <span className="combat-stat__label">Competencia</span>
    </div>
  </div>
);

// Main CharacterSheet component
const CharacterSheet = ({ character }) => {
  if (!character) {
    return (
      <div className="character-sheet character-sheet--empty">
        <Panel variant="dark" title="Personaje" icon={<ShieldIcon size={20} />}>
          <p className="empty-message">No hay personaje cargado</p>
        </Panel>
      </div>
    );
  }

  // Extract character data - adapt to backend format
  const {
    currentHP = 14,
    maxHP = 14,
    ac = 15,
    inventory = [],
    equipment = [],
    clues = [],
  } = character;

  
  const defaultAttributes = {
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  };

  const defaultSkills = {
    
  };

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
              <p className="character-portrait__class">Pícaro • Nivel 2</p>
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
            <CombatStats ac={ac} speed={0} profBonus={0} />
          </div>
        </Panel>
      </div>

      {/* Main content - two columns */}
      <div className="character-sheet__body">
        {/* Left column - Attributes */}
        <Panel variant="dark" title="Atributos" icon={<AttributesIcon size={20} />} className="attributes-panel">
          <div className="attributes-grid">
            {Object.entries(defaultAttributes).map(([attr, score]) => (
              <AttributeBox key={attr} attribute={attr} score={score} />
            ))}
          </div>
        </Panel>

        {/* Right column - Skills */}
        <Panel variant="dark" title="Habilidades" icon={<SkillsIcon size={20} />} className="skills-panel">
          <div className="skills-container">
            <SkillList skills={defaultSkills} attributes={defaultAttributes} />
          </div>
        </Panel>
      </div>

      {/* Saving throws */}
      <Panel variant="dark" title="Tiradas de Salvación" icon={<ShieldIcon size={20} />} className="saves-panel">
        <div className="saves-grid">
          {Object.entries(defaultAttributes).map(([attr, score]) => {
            const modifier = getAttributeModifier(score);
            const isProficient = attr === 'Dexterity' || attr === 'Intelligence';
            const bonus = isProficient ? modifier + 2 : modifier;
            
            return (
              <div key={attr} className={`save-item ${isProficient ? 'save-item--proficient' : ''}`}>
                <span className="save-item__prof">{isProficient ? '●' : '○'}</span>
                <span className="save-item__name">{ATTRIBUTE_ABBR[attr]}</span>
                <span className={`save-item__bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
                  {formatModifier(bonus)}
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
            {equipment.map((item, idx) => (
              <div key={idx} className="equipment-item">
                <span className="equipment-item__icon"><SwordIcon size={24} /></span>
                <div className="equipment-item__info">
                  <span className="equipment-item__name">{item.name}</span>
                  <span className="equipment-item__desc">{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
};

export default CharacterSheet;
