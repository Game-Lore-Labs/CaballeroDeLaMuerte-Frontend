// ============================================================================
// src/components/ui/Panel.jsx - Decorative RPG Panel Component
// ============================================================================

import React from 'react';
import './Panel.css';

const Panel = ({ 
  children, 
  variant = 'dark', 
  className = '',
  title,
  icon,
  cornerOrnaments = true,
  ...props 
}) => {
  return (
    <div 
      className={`rpg-panel rpg-panel--${variant} ${className}`}
      {...props}
    >
      {/* Corner ornaments */}
      {cornerOrnaments && (
        <>
          <span className="rpg-panel__corner rpg-panel__corner--tl" />
          <span className="rpg-panel__corner rpg-panel__corner--tr" />
          <span className="rpg-panel__corner rpg-panel__corner--bl" />
          <span className="rpg-panel__corner rpg-panel__corner--br" />
        </>
      )}
      
      {/* Border decoration */}
      <span className="rpg-panel__border-decor rpg-panel__border-decor--top" />
      <span className="rpg-panel__border-decor rpg-panel__border-decor--bottom" />
      <span className="rpg-panel__border-decor rpg-panel__border-decor--left" />
      <span className="rpg-panel__border-decor rpg-panel__border-decor--right" />
      
      {/* Header */}
      {title && (
        <div className="rpg-panel__header">
          {icon && <span className="rpg-panel__header-icon">{icon}</span>}
          <h3 className="rpg-panel__title">{title}</h3>
          <span className="rpg-panel__header-line" />
        </div>
      )}
      
      {/* Content */}
      <div className="rpg-panel__content">
        {children}
      </div>
      
      {/* Texture overlay */}
      <div className="rpg-panel__texture" />
    </div>
  );
};

export default Panel;
