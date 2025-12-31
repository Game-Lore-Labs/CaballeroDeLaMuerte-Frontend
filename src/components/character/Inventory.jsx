// ============================================================================
// src/components/character/Inventory.jsx - Medieval Inventory Component
// ============================================================================

import React, { useState } from 'react';
import { Panel } from '../ui';
import { guessItemIcon } from '../../utils/constants';
import './Inventory.css';

// Individual inventory slot
const InventorySlot = ({ item, index, isSelected, onClick }) => {
  const isEmpty = !item;
  const icon = item ? guessItemIcon(item.name) : null;
  
  return (
    <div 
      className={`inventory-slot ${isEmpty ? 'inventory-slot--empty' : ''} ${isSelected ? 'inventory-slot--selected' : ''}`}
      onClick={() => !isEmpty && onClick(index)}
    >
      <div className="inventory-slot__bg" />
      {item && (
        <>
          <span className="inventory-slot__icon">{icon}</span>
          <span className="inventory-slot__shine" />
        </>
      )}
      <span className="inventory-slot__index">{index + 1}</span>
    </div>
  );
};

// Item detail tooltip/panel
const ItemDetail = ({ item }) => {
  if (!item) return null;
  
  const icon = guessItemIcon(item.name);
  
  return (
    <div className="item-detail">
      <div className="item-detail__header">
        <span className="item-detail__icon">{icon}</span>
        <h3 className="item-detail__name">{item.name}</h3>
      </div>
      <div className="item-detail__divider" />
      <p className="item-detail__description">{item.description}</p>
      <div className="item-detail__id">ID: {item.id}</div>
    </div>
  );
};

// Equipment slot
const EquipmentSlot = ({ item, slotName, slotIcon }) => {
  const icon = item ? guessItemIcon(item.name) : null;
  
  return (
    <div className={`equipment-slot ${!item ? 'equipment-slot--empty' : ''}`}>
      <div className="equipment-slot__frame">
        {item ? (
          <span className="equipment-slot__item-icon">{icon}</span>
        ) : (
          <span className="equipment-slot__placeholder">{slotIcon}</span>
        )}
      </div>
      <span className="equipment-slot__name">{slotName}</span>
      {item && <span className="equipment-slot__item-name">{item.name}</span>}
    </div>
  );
};

// Main Inventory component
const Inventory = ({ inventory = [], equipment = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  // Create a grid of 24 slots (4 rows x 6 columns)
  const SLOT_COUNT = 24;
  const slots = Array(SLOT_COUNT).fill(null).map((_, i) => inventory[i] || null);
  
  const selectedItem = selectedIndex !== null ? slots[selectedIndex] : null;

  // Equipment slots definition
  const equipmentSlots = [
    { key: 'head', name: 'Cabeza', icon: '👑' },
    { key: 'armor', name: 'Armadura', icon: '🛡️' },
    { key: 'mainHand', name: 'Mano Principal', icon: '⚔️' },
    { key: 'offHand', name: 'Mano Secundaria', icon: '🗡️' },
    { key: 'ring1', name: 'Anillo', icon: '💍' },
    { key: 'ring2', name: 'Anillo', icon: '💍' },
  ];

  return (
    <div className="inventory-container">
      {/* Equipment section */}
      <div className="inventory-equipment">
        <Panel variant="gold" title="Equipamiento" icon="⚔️">
          <div className="equipment-grid">
            <div className="equipment-character">
              <div className="equipment-character__silhouette">
                <span>🧙</span>
              </div>
            </div>
            <div className="equipment-slots">
              {equipmentSlots.map((slot, idx) => (
                <EquipmentSlot
                  key={slot.key}
                  item={equipment[idx] || null}
                  slotName={slot.name}
                  slotIcon={slot.icon}
                />
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Main inventory grid */}
      <div className="inventory-main">
        <Panel variant="dark" title="Bolsa de Inventario" icon="🎒">
          <div className="inventory-grid-wrapper">
            {/* Parchment texture overlay */}
            <div className="inventory-grid__texture" />
            
            {/* Inventory slots grid */}
            <div className="inventory-grid">
              {slots.map((item, index) => (
                <InventorySlot
                  key={index}
                  item={item}
                  index={index}
                  isSelected={selectedIndex === index}
                  onClick={setSelectedIndex}
                />
              ))}
            </div>

            {/* Capacity indicator */}
            <div className="inventory-capacity">
              <span className="inventory-capacity__label">Capacidad:</span>
              <span className="inventory-capacity__value">
                {inventory.length} / {SLOT_COUNT}
              </span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Item detail panel */}
      <div className="inventory-detail">
        <Panel variant="parchment" title="Detalles del Objeto" icon="📋">
          {selectedItem ? (
            <ItemDetail item={selectedItem} />
          ) : (
            <div className="inventory-detail__empty">
              <p>Selecciona un objeto para ver sus detalles</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default Inventory;
