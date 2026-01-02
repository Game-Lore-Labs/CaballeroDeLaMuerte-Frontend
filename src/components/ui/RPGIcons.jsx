// ============================================================================
// src/components/ui/RPGIcons.jsx - Professional RPG-themed SVG Icons
// ============================================================================

import React from 'react';
import './RPGIcons.css';

// Icon wrapper component
const IconWrapper = ({ children, size = 24, className = '', color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`rpg-icon ${className}`}
    {...props}
  >
    {children}
  </svg>
);

// === ATTRIBUTE ICONS ===

export const StrengthIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M7 7V6a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v1" fill="currentColor" opacity="0.15"/>
    <path d="M14 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
    <path d="M18 9v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8v-3a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/>
    <path d="M7 12v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/>
    <path d="M11 11v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
  </IconWrapper>
);

export const DexterityIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" fill="currentColor" opacity="0.15"/>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
    <line x1="16" y1="8" x2="2" y2="22"/>
    <line x1="17.5" y1="15" x2="9" y2="15"/>
  </IconWrapper>
);

export const ConstitutionIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" opacity="0.15"/>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    <path d="M12 8v6M9 11h6"/>
  </IconWrapper>
);

export const IntelligenceIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="currentColor" opacity="0.15"/>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    <path d="M6 8h2M6 12h2M14 8h4M14 12h4"/>
  </IconWrapper>
);

export const WisdomIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
    <path d="M12 5C5.636 5 2 12 2 12s3.636 7 10 7 10-7 10-7-3.636-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </IconWrapper>
);

export const CharismaIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M2 18l3-9 5 5 4-8 4 8 5-5-3 9H2z" fill="currentColor" opacity="0.15"/>
    <path d="M2 18l3-9 5 5 4-8 4 8 5-5-3 9H2z"/>
    <path d="M2 18h20v3H2z" fill="currentColor" opacity="0.1"/>
    <circle cx="5" cy="9" r="1" fill="currentColor"/>
    <circle cx="12" cy="6" r="1" fill="currentColor"/>
    <circle cx="19" cy="9" r="1" fill="currentColor"/>
  </IconWrapper>
);

// === PANEL & UI ICONS ===

export const AttributesIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M12 2L2 12l10 10 10-10L12 2z" fill="currentColor" opacity="0.15"/>
    <path d="M12 2L2 12l10 10 10-10L12 2z"/>
    <path d="M12 6v12M6 12h12"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3"/>
  </IconWrapper>
);

export const SkillsIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </IconWrapper>
);

export const ShieldIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" opacity="0.15"/>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </IconWrapper>
);

export const SwordIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" fill="currentColor" opacity="0.15"/>
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
    <path d="M13 19l6-6M15 21l6-6"/>
    <path d="M19 13l2-2-6-6-2 2"/>
  </IconWrapper>
);

export const CrossedSwordsIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M6 20L3 17l9-9-1-1 2-2 5 5-2 2-1-1-9 9z" fill="currentColor" opacity="0.1"/>
    <path d="M18 20l3-3-9-9 1-1-2-2-5 5 2 2 1-1 9 9z" fill="currentColor" opacity="0.1"/>
    <path d="M6 20L3 17l9-9-1-1 2-2 5 5-2 2-1-1-9 9z"/>
    <path d="M18 20l3-3-9-9 1-1-2-2-5 5 2 2 1-1 9 9z"/>
  </IconWrapper>
);

export const InventoryIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M5 10h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z" fill="currentColor" opacity="0.15"/>
    <path d="M5 10h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z"/>
    <path d="M8 10V6a4 4 0 0 1 8 0v4"/>
    <path d="M9 14h6M12 14v4"/>
  </IconWrapper>
);

export const ScrollIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H8z" fill="currentColor" opacity="0.15"/>
    <path d="M14 2v6h6"/>
    <path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
    <path d="M8 13h8M8 17h5"/>
  </IconWrapper>
);

export const CluesIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="11" r="8" fill="currentColor" opacity="0.1"/>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.2"/>
  </IconWrapper>
);

export const HistoryIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M5 4h14v4l-5 4 5 4v4H5v-4l5-4-5-4V4z" fill="currentColor" opacity="0.15"/>
    <path d="M5 4h14M5 20h14"/>
    <path d="M7 4v4l5 4-5 4v4"/>
    <path d="M17 4v4l-5 4 5 4v4"/>
  </IconWrapper>
);

export const AdventureIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="currentColor" opacity="0.15"/>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="currentColor" opacity="0.1"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M8 7h8M8 11h6"/>
  </IconWrapper>
);

export const CharacterIcon = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="7" r="4" fill="currentColor" opacity="0.15"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" fill="currentColor" opacity="0.1"/>
    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
  </IconWrapper>
);

export const HeartIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
  </IconWrapper>
);

export const SaveIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" fill="currentColor" opacity="0.15"/>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <path d="M17 21v-8H7v8"/>
    <path d="M7 3v5h8"/>
  </IconWrapper>
);

export const LoadIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor" opacity="0.15"/>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </IconWrapper>
);

export const CombatIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M15.5 4.5l4 4-8 8-4-4 8-8z" fill="currentColor" opacity="0.15"/>
    <path d="M14 12l-4 4M8 16l-4 4"/>
    <path d="M15.5 4.5l4 4-8 8-4-4 8-8z"/>
  </IconWrapper>
);

// === EQUIPMENT SLOT ICONS (Magical Style) ===

export const HelmetIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <path d="M4 12h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z" fill="url(#helmetGradient)"/>
    <path d="M4 12h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z"/>
    <path d="M6 12V8a6 6 0 0 1 12 0v4"/>
    <path d="M4 15h16"/>
    <path d="M9 21v-2M15 21v-2"/>
    <circle cx="12" cy="6" r="1" fill="currentColor" opacity="0.4"/>
  </IconWrapper>
);

export const ArmorIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="armorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.08"/>
      </linearGradient>
    </defs>
    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="url(#armorGradient)"/>
    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
    <path d="M12 8v4M9 10h6"/>
    <circle cx="12" cy="16" r="1.5" fill="none" strokeWidth="1"/>
  </IconWrapper>
);

export const MainHandIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="mainHandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <path d="M19 3L5 17l2 2L21 5l-2-2z" fill="url(#mainHandGradient)"/>
    <path d="M19 3L5 17l2 2L21 5l-2-2z"/>
    <path d="M3 19l2 2"/>
    <path d="M5 17l4 4"/>
    <path d="M8.5 13.5l-3 3M10.5 15.5l-3 3"/>
    <path d="M14 8l2-2" strokeWidth="2" opacity="0.4"/>
  </IconWrapper>
);

export const OffHandIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="offHandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.08"/>
      </linearGradient>
    </defs>
    <path d="M14.5 9.5L6 18l1.5 1.5L16 11l-1.5-1.5z" fill="url(#offHandGradient)"/>
    <path d="M14.5 9.5L6 18l1.5 1.5L16 11l-1.5-1.5z"/>
    <path d="M4.5 19.5l1.5 1.5"/>
    <path d="M9.5 14.5L18 6l-1.5-1.5L8 13l1.5 1.5z" opacity="0.5"/>
    <path d="M19.5 4.5l-1.5-1.5" opacity="0.5"/>
  </IconWrapper>
);

export const RingIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.15"/>
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="14" rx="7" ry="4" fill="url(#ringGradient)"/>
    <ellipse cx="12" cy="14" rx="7" ry="4"/>
    <ellipse cx="12" cy="14" rx="4" ry="2"/>
    <path d="M12 6l-2 4h4l-2-4z" fill="currentColor" opacity="0.3"/>
    <path d="M12 6l-2 4h4l-2-4z"/>
    <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.5"/>
  </IconWrapper>
);

// === ITEM TYPE ICONS (Magical Style) ===

export const LeatherArmorIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="leatherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <path d="M6 4h12l2 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l2-4z" fill="url(#leatherGradient)"/>
    <path d="M6 4h12l2 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8l2-4z"/>
    <path d="M8 4v3a4 4 0 0 0 8 0V4"/>
    <path d="M12 10v8" strokeDasharray="2 2"/>
    <path d="M8 12h8" strokeDasharray="2 2"/>
    <rect x="10" y="14" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.25"/>
  </IconWrapper>
);

export const ShortSwordIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="steelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.12"/>
      </linearGradient>
    </defs>
    <path d="M17 3L7 13l1.5 1.5L19 4l-2-1z" fill="url(#steelGradient)"/>
    <path d="M17 3L7 13l1.5 1.5L19 4l-2-1z"/>
    <path d="M5 15l2 2"/>
    <rect x="5.5" y="14" width="3" height="5" rx="0.5" transform="rotate(45 7 16.5)" fill="currentColor" opacity="0.2"/>
    <path d="M7.5 12.5l-2 2M9 14l-2 2"/>
    <path d="M13 7l2-2" strokeWidth="1" opacity="0.5"/>
  </IconWrapper>
);

export const DaggerIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="daggerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <path d="M12 2L8 12l4 2 4-2L12 2z" fill="url(#daggerGradient)"/>
    <path d="M12 2L8 12l4 2 4-2L12 2z"/>
    <rect x="10" y="14" width="4" height="6" rx="1" fill="currentColor" opacity="0.2"/>
    <path d="M10 14h4v6h-4z"/>
    <path d="M7 12h10"/>
    <circle cx="12" cy="21" r="1" fill="currentColor" opacity="0.3"/>
  </IconWrapper>
);

export const HandCrossbowIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="crossbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <path d="M4 14h12l2 4H6l-2-4z" fill="url(#crossbowGradient)"/>
    <path d="M4 14h12l2 4H6l-2-4z"/>
    <path d="M8 14c-3-3-3-8 0-8"/>
    <path d="M8 14c3-3 3-8 0-8"/>
    <path d="M5 9l6 5M11 9l-6 5" strokeDasharray="1 1"/>
    <path d="M10 12l8-8" strokeWidth="2"/>
    <path d="M18 4l2-2"/>
    <path d="M12 18v2"/>
  </IconWrapper>
);

export const PotionIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="potionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.45"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
    <path d="M8 3h8v4l2 8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4l2-8V3z" fill="url(#potionGradient)"/>
    <path d="M8 3h8v4l2 8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4l2-8V3z"/>
    <rect x="9" y="1" width="6" height="2" rx="0.5" fill="currentColor" opacity="0.3"/>
    <path d="M7 13c1 1 3 1 5 0s4-1 5 0"/>
    <circle cx="10" cy="15" r="1" fill="currentColor" opacity="0.25"/>
    <circle cx="13" cy="17" r="0.5" fill="currentColor" opacity="0.25"/>
    <path d="M14 10l1-1M15 11l1-1" strokeWidth="1" opacity="0.4"/>
  </IconWrapper>
);

export const KeyIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="keyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.15"/>
      </linearGradient>
    </defs>
    <circle cx="8" cy="8" r="5" fill="url(#keyGradient)"/>
    <circle cx="8" cy="8" r="5"/>
    <circle cx="8" cy="8" r="2"/>
    <path d="M12 12l8 8"/>
    <path d="M17 17l2 0M18 18l0 2M19 19l2 0"/>
    <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.35"/>
  </IconWrapper>
);

export const TreasureIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.45"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" fill="url(#gemGradient)"/>
    <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
    <path d="M2 9h20"/>
    <path d="M12 21L6 9l6-6 6 6-6 12z"/>
    <circle cx="12" cy="9" r="1" fill="currentColor" opacity="0.5"/>
    <path d="M8 6l1 1M16 6l-1 1" strokeWidth="1" opacity="0.4"/>
  </IconWrapper>
);

export const ToolIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="toolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="url(#toolGradient)"/>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </IconWrapper>
);

export const FoodIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="foodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.12"/>
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="14" rx="8" ry="5" fill="url(#foodGradient)"/>
    <ellipse cx="12" cy="14" rx="8" ry="5"/>
    <path d="M4 10c-1-2 0-4 2-4s3 2 2 4"/>
    <path d="M20 10c1-2 0-4-2-4s-3 2-2 4"/>
    <path d="M6 10h12"/>
    <path d="M10 8c0-2 1-3 0-4M14 8c0-2-1-3 0-4" opacity="0.35"/>
  </IconWrapper>
);

export const MiscItemIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="miscGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05"/>
      </linearGradient>
    </defs>
    <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" fill="url(#miscGradient)"/>
    <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/>
    <path d="M3 8h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" fill="url(#miscGradient)"/>
    <path d="M3 8h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
    <path d="M12 12v4M12 18v.01"/>
    <circle cx="12" cy="14" r="3" fill="none" strokeDasharray="2 1"/>
  </IconWrapper>
);

export const MagicIcon = (props) => (
  <IconWrapper {...props}>
    <defs>
      <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.15"/>
      </linearGradient>
    </defs>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" fill="url(#magicGradient)"/>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.35"/>
  </IconWrapper>
);

export const QuillIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" fill="currentColor" opacity="0.15"/>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
    <line x1="16" y1="8" x2="2" y2="22"/>
  </IconWrapper>
);

export const EmptySlotIcon = (props) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.03"/>
    <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" opacity="0.4"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.08"/>
  </IconWrapper>
);

// Export all icons as a map
export const RPGIcons = {
  strength: StrengthIcon,
  dexterity: DexterityIcon,
  constitution: ConstitutionIcon,
  intelligence: IntelligenceIcon,
  wisdom: WisdomIcon,
  charisma: CharismaIcon,
  attributes: AttributesIcon,
  skills: SkillsIcon,
  shield: ShieldIcon,
  sword: SwordIcon,
  crossedSwords: CrossedSwordsIcon,
  inventory: InventoryIcon,
  scroll: ScrollIcon,
  clues: CluesIcon,
  history: HistoryIcon,
  adventure: AdventureIcon,
  character: CharacterIcon,
  heart: HeartIcon,
  save: SaveIcon,
  load: LoadIcon,
  combat: CombatIcon,
  helmet: HelmetIcon,
  armor: ArmorIcon,
  mainHand: MainHandIcon,
  offHand: OffHandIcon,
  ring: RingIcon,
  leatherArmor: LeatherArmorIcon,
  shortSword: ShortSwordIcon,
  dagger: DaggerIcon,
  handCrossbow: HandCrossbowIcon,
  potion: PotionIcon,
  key: KeyIcon,
  treasure: TreasureIcon,
  tool: ToolIcon,
  food: FoodIcon,
  misc: MiscItemIcon,
  magic: MagicIcon,
  quill: QuillIcon,
  emptySlot: EmptySlotIcon,
};

// Helper function to get icon by item name
export const getItemIcon = (itemName) => {
  const lowerName = itemName?.toLowerCase() || '';
  
  if (lowerName.includes('armadura de cuero') || lowerName.includes('leather armor')) return LeatherArmorIcon;
  if (lowerName.includes('espada corta') || lowerName.includes('short sword')) return ShortSwordIcon;
  if (lowerName.includes('daga') || lowerName.includes('dagger')) return DaggerIcon;
  if (lowerName.includes('ballesta') || lowerName.includes('crossbow')) return HandCrossbowIcon;
  if (lowerName.includes('poción') || lowerName.includes('potion') || lowerName.includes('elixir')) return PotionIcon;
  if (lowerName.includes('llave') || lowerName.includes('key')) return KeyIcon;
  if (lowerName.includes('gema') || lowerName.includes('oro') || lowerName.includes('gold') || lowerName.includes('treasure')) return TreasureIcon;
  if (lowerName.includes('herramienta') || lowerName.includes('tool') || lowerName.includes('cuerda') || lowerName.includes('rope')) return ToolIcon;
  if (lowerName.includes('comida') || lowerName.includes('ración') || lowerName.includes('food') || lowerName.includes('ration')) return FoodIcon;
  if (lowerName.includes('escudo') || lowerName.includes('shield')) return ShieldIcon;
  if (lowerName.includes('casco') || lowerName.includes('yelmo') || lowerName.includes('helmet')) return HelmetIcon;
  if (lowerName.includes('anillo') || lowerName.includes('ring')) return RingIcon;
  if (lowerName.includes('espada') || lowerName.includes('sword')) return SwordIcon;
  if (lowerName.includes('pergamino') || lowerName.includes('scroll')) return ScrollIcon;
  if (lowerName.includes('armadura') || lowerName.includes('armor')) return ArmorIcon;
  
  return MiscItemIcon;
};

// Icon component that accepts name prop
export const RPGIcon = ({ name, ...props }) => {
  const IconComponent = RPGIcons[name];
  if (!IconComponent) {
    return <MiscItemIcon {...props} />;
  }
  return <IconComponent {...props} />;
};

export default RPGIcon;
