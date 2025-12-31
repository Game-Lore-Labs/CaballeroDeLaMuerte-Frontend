// ============================================================================
// src/components/ui/Button.jsx - RPG Styled Button Component
// ============================================================================

import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  ...props 
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`rpg-button rpg-button--${variant} rpg-button--${size} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      <span className="rpg-button__border-top" />
      <span className="rpg-button__border-bottom" />
      <span className="rpg-button__corner rpg-button__corner--tl" />
      <span className="rpg-button__corner rpg-button__corner--tr" />
      <span className="rpg-button__corner rpg-button__corner--bl" />
      <span className="rpg-button__corner rpg-button__corner--br" />
      
      <span className="rpg-button__content">
        {loading ? (
          <span className="rpg-button__loader">
            <span className="rpg-button__loader-dot" />
            <span className="rpg-button__loader-dot" />
            <span className="rpg-button__loader-dot" />
          </span>
        ) : (
          <>
            {icon && <span className="rpg-button__icon">{icon}</span>}
            <span className="rpg-button__text">{children}</span>
          </>
        )}
      </span>
      
      <span className="rpg-button__shine" />
    </button>
  );
};

export default Button;
