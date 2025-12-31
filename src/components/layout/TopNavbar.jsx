// ============================================================================
// src/components/layout/TopNavbar.jsx - Main Navigation Bar
// ============================================================================

import React from 'react';
import './TopNavbar.css';

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    className={`nav-item ${active ? 'nav-item--active' : ''}`}
    onClick={onClick}
  >
    <span className="nav-item__icon">{icon}</span>
    <span className="nav-item__label">{label}</span>
    {badge > 0 && <span className="nav-item__badge">{badge}</span>}
    <span className="nav-item__glow" />
  </button>
);

const TopNavbar = ({ 
  activeTab, 
  onTabChange, 
  character,
  onSave,
  onLoad,
  saving = false,
}) => {
  const navItems = [
    { id: 'adventure', icon: '📖', label: 'Aventura' },
    { id: 'character', icon: '👤', label: 'Personaje' },
    { id: 'inventory', icon: '🎒', label: 'Inventario', badge: character?.inventory?.length || 0 },
    { id: 'clues', icon: '🔍', label: 'Pistas', badge: character?.clues?.length || 0 },
    { id: 'history', icon: '📜', label: 'Historial' },
  ];

  return (
    <nav className="top-navbar">
      {/* Background texture */}
      <div className="top-navbar__bg" />
      
      {/* Left section - Logo/Title */}
      <div className="top-navbar__brand">
        <span className="top-navbar__brand-icon">⚔️</span>
        <div className="top-navbar__brand-text">
          <span className="top-navbar__title">Caballero de la Muerte</span>
          <span className="top-navbar__subtitle">
            {character ? `${character.currentHP}/${character.maxHP} PV` : 'Aventura'}
          </span>
        </div>
      </div>
      
      {/* Center section - Navigation tabs */}
      <div className="top-navbar__tabs">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
      
      {/* Right section - Actions */}
      <div className="top-navbar__actions">
        <button 
          className="navbar-action-btn" 
          onClick={onLoad}
          title="Cargar partida"
        >
          <span>📂</span>
        </button>
        <button 
          className="navbar-action-btn" 
          onClick={onSave}
          disabled={saving}
          title="Guardar partida"
        >
          <span>{saving ? '⏳' : '💾'}</span>
        </button>
      </div>
      
      {/* Bottom border decoration */}
      <div className="top-navbar__border" />
    </nav>
  );
};

export default TopNavbar;
