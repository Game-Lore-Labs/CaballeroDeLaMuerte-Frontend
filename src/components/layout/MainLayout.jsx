// ============================================================================
// src/components/layout/MainLayout.jsx - Main Application Layout
// ============================================================================

import React from 'react';
import TopNavbar from './TopNavbar';
import './MainLayout.css';

const MainLayout = ({ 
  children, 
  activeTab, 
  onTabChange, 
  character,
  onSave,
  onLoad,
  saving,
}) => {
  return (
    <div className="main-layout">
      {/* Background */}
      <div className="main-layout__bg">
        <div className="main-layout__bg-gradient" />
        <div className="main-layout__bg-pattern" />
        <div className="main-layout__bg-vignette" />
      </div>
      
      {/* Navigation */}
      <TopNavbar
        activeTab={activeTab}
        onTabChange={onTabChange}
        character={character}
        onSave={onSave}
        onLoad={onLoad}
        saving={saving}
      />
      
      {/* Main Content */}
      <main className="main-layout__content">
        {children}
      </main>
      
      {/* Footer decoration */}
      <div className="main-layout__footer">
        <div className="main-layout__footer-line" />
      </div>
    </div>
  );
};

export default MainLayout;
