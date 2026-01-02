// ============================================================================
// src/components/character/Inventory.jsx - Medieval Inventory Component
// ============================================================================

import React, { useState } from 'react';
import { 
  Panel,
  getItemIcon,
  HelmetIcon,
  ArmorIcon,
  MainHandIcon,
  OffHandIcon,
  RingIcon,
  EmptySlotIcon,
  InventoryIcon,
  ScrollIcon,
} from '../ui';
import './Inventory.css';

// Individual inventory slot
const InventorySlot = ({ item, index, isSelected, onClick }) => {
  const isEmpty = !item;
  const ItemIcon = item ? getItemIcon(item.name) : null;
  
  return (
    <div 
      className={`inventory-slot ${isEmpty ? 'inventory-slot--empty' : ''} ${isSelected ? 'inventory-slot--selected' : ''}`}
      onClick={() => !isEmpty && onClick(index)}
    >
      <div className="inventory-slot__bg" />
      {item ? (
        <>
          <span className="inventory-slot__icon">
            <ItemIcon size={28} />
          </span>
          <span className="inventory-slot__shine" />
        </>
      ) : (
        <span className="inventory-slot__empty-icon">
          <EmptySlotIcon size={20} />
        </span>
      )}
      <span className="inventory-slot__index">{index + 1}</span>
    </div>
  );
};

// Item detail panel
const ItemDetail = ({ item }) => {
  if (!item) {
    return (
      <div className="item-detail item-detail--empty">
        <div className="item-detail__empty-icon">
          <ScrollIcon size={48} />
        </div>
        <p className="item-detail__empty-text">
          Selecciona un objeto para ver sus detalles
        </p>
      </div>
    );
  }
  
  const ItemIcon = getItemIcon(item.name);
  
  return (
    <div className="item-detail">
      <div className="item-detail__header">
        <div className="item-detail__icon-frame">
          <ItemIcon size={36} />
        </div>
        <h3 className="item-detail__name">{item.name}</h3>
      </div>
      <div className="item-detail__divider">
        <span className="item-detail__divider-ornament">◆</span>
      </div>
      <p className="item-detail__description">{item.description}</p>
      <div className="item-detail__footer">
        <span className="item-detail__id">Ref: {item.id}</span>
      </div>
    </div>
  );
};

// Equipment slot component
const EquipmentSlot = ({ item, slotName, SlotIcon, onClick, isSelected }) => {
  const ItemIcon = item ? getItemIcon(item.name) : null;
  
  return (
    <div 
      className={`equipment-slot ${!item ? 'equipment-slot--empty' : ''} ${isSelected ? 'equipment-slot--selected' : ''}`}
      onClick={onClick}
    >
      <div className="equipment-slot__frame">
        {item ? (
          <span className="equipment-slot__item-icon">
            <ItemIcon size={32} />
          </span>
        ) : (
          <span className="equipment-slot__placeholder">
            <SlotIcon size={24} />
          </span>
        )}
        <div className="equipment-slot__shine" />
      </div>
      <span className="equipment-slot__name">{slotName}</span>
      {item && <span className="equipment-slot__item-name">{item.name}</span>}
    </div>
  );
};

// Main Inventory component
const Inventory = ({ inventory = [], equipment = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  // Create a grid of 24 slots (4 rows x 6 columns)
  const SLOT_COUNT = 24;
  const slots = Array(SLOT_COUNT).fill(null).map((_, i) => inventory[i] || null);
  
  // Get selected item (from inventory or equipment)
  const getSelectedItem = () => {
    if (selectedEquipment !== null && equipment[selectedEquipment]) {
      return equipment[selectedEquipment];
    }
    if (selectedIndex !== null && slots[selectedIndex]) {
      return slots[selectedIndex];
    }
    return null;
  };

  const selectedItem = getSelectedItem();

  // Handle inventory slot click
  const handleInventoryClick = (index) => {
    setSelectedEquipment(null);
    setSelectedIndex(index);
  };

  // Handle equipment slot click
  const handleEquipmentClick = (index) => {
    setSelectedIndex(null);
    setSelectedEquipment(index);
  };

  // Equipment slots definition
  const equipmentSlots = [
    { key: 'armor', name: 'Armadura', SlotIcon: ArmorIcon },
    { key: 'mainHand', name: 'Mano Principal', SlotIcon: MainHandIcon },
    { key: 'offHand', name: 'Mano Secundaria', SlotIcon: OffHandIcon },
  ];

  return (
    <div className="inventory-container">
      {/* Equipment section */}
      <div className="inventory-equipment">
        <Panel variant="gold" title="Equipamiento" icon={<MainHandIcon size={20} />}>
          <div className="equipment-grid">
            <div className="equipment-character">
              <div className="equipment-character__frame">
                <video 
                  className="equipment-character__video"
                  src="/video/iksapen.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
            <div className="equipment-slots">
              {equipmentSlots.map((slot, idx) => (
                <EquipmentSlot
                  key={slot.key}
                  item={equipment[idx] || null}
                  slotName={slot.name}
                  SlotIcon={slot.SlotIcon}
                  onClick={() => equipment[idx] && handleEquipmentClick(idx)}
                  isSelected={selectedEquipment === idx}
                />
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Main inventory grid */}
      <div className="inventory-main">
        <Panel variant="dark" title="Bolsa de Inventario" icon={<InventoryIcon size={20} />}>
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
                  onClick={handleInventoryClick}
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
        <Panel variant="parchment" title="Detalles del Objeto" icon={<ScrollIcon size={20} />}>
          <ItemDetail item={selectedItem} />
        </Panel>
      </div>
    </div>
  );
};

export default Inventory;
