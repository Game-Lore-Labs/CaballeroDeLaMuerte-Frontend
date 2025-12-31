// ============================================================================
// src/components/ui/StatBar.jsx - Stat Bar Component (HP, XP, etc.)
// ============================================================================

import React from 'react';
import './StatBar.css';

const StatBar = ({ 
  current, 
  max, 
  label,
  variant = 'health', // health, mana, xp
  showText = true,
  size = 'medium',
  animated = true,
  className = '',
}) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Determine health status for color changes
  let statusClass = '';
  if (variant === 'health') {
    if (percentage <= 25) statusClass = 'critical';
    else if (percentage <= 50) statusClass = 'wounded';
    else statusClass = 'healthy';
  }

  return (
    <div className={`stat-bar-wrapper stat-bar-wrapper--${size} ${className}`}>
      {label && (
        <div className="stat-bar-label">
          <span className="stat-bar-label__text">{label}</span>
          {showText && (
            <span className="stat-bar-label__value">
              {current}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className={`stat-bar stat-bar--${variant} stat-bar--${statusClass}`}>
        {/* Background texture */}
        <div className="stat-bar__bg" />
        
        {/* Fill bar */}
        <div 
          className={`stat-bar__fill ${animated ? 'stat-bar__fill--animated' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="stat-bar__shine" />
          
          {/* Segment lines */}
          <div className="stat-bar__segments">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="stat-bar__segment" />
            ))}
          </div>
        </div>
        
        {/* Value text overlay */}
        {showText && !label && (
          <div className="stat-bar__text">
            {current}/{max}
          </div>
        )}
        
        {/* Border frame */}
        <div className="stat-bar__frame" />
      </div>
    </div>
  );
};

export default StatBar;
