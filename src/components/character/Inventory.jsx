// ============================================================================
// src/components/character/Inventory.jsx - Medieval Inventory Component
// ============================================================================

import React, { useState } from 'react';
import { 
  Panel,
  getItemIcon,
  ArmorIcon,
  MainHandIcon,
  OffHandIcon,
  EmptySlotIcon,
  InventoryIcon,
  ScrollIcon,
  MiscItemIcon,
} from '../ui';
import './Inventory.css';

// Función para obtener la ruta del icono basándose en el ID del item
// Intenta cargar directamente /Icons/{id}.png
const getItemIconPath = (itemId) => {
  if (!itemId) return null;
  return `/Icons/${itemId}.png`;
};

// Individual inventory slot
const InventorySlot = ({ item, index, isSelected, onClick }) => {
  const isEmpty = !item;
  const iconPath = item ? getItemIconPath(item.id) : null;
  const FallbackIcon = item ? (getItemIcon(item.name) || MiscItemIcon) : null;
  
  return (
    <div 
      className={`inventory-slot ${isEmpty ? 'inventory-slot--empty' : ''} ${isSelected ? 'inventory-slot--selected' : ''}`}
      onClick={() => !isEmpty && onClick(index)}
    >
      <div className="inventory-slot__bg" />
      {item ? (
        <>
          <span className="inventory-slot__icon">
            <img 
              src={iconPath} 
              alt={item.name} 
              className="inventory-slot__img"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <span className="inventory-slot__fallback" style={{ display: 'none' }}>
              <FallbackIcon size={28} />
            </span>
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
  
  const iconPath = getItemIconPath(item.id);
  const FallbackIcon = getItemIcon(item.name) || MiscItemIcon;
  
  return (
    <div className="item-detail">
      <div className="item-detail__header">
        <div className="item-detail__icon-frame">
          <img 
            src={iconPath} 
            alt={item.name} 
            className="item-detail__img"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <span className="item-detail__fallback" style={{ display: 'none' }}>
            <FallbackIcon size={36} />
          </span>
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
  const iconPath = item ? getItemIconPath(item.id) : null;
  const FallbackIcon = item ? (getItemIcon(item.name) || MiscItemIcon) : null;
  
  return (
    <div 
      className={`equipment-slot ${!item ? 'equipment-slot--empty' : ''} ${isSelected ? 'equipment-slot--selected' : ''}`}
      onClick={onClick}
    >
      <div className="equipment-slot__frame">
        {item ? (
          <span className="equipment-slot__item-icon">
            <img 
              src={iconPath} 
              alt={item.name} 
              className="equipment-slot__img"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <span className="equipment-slot__fallback" style={{ display: 'none' }}>
              <FallbackIcon size={32} />
            </span>
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
  
  // Find equipment by slot type
  const getEquipmentBySlot = (slotKey) => {
    if (!equipment || equipment.length === 0) return null;
    
    switch (slotKey) {
      case 'armor':
        // Buscar armadura o ropa (armor, light_armor, medium_armor, heavy_armor)
        return equipment.find(item => 
          item.type === 'armor' || 
          item.type === 'light_armor' || 
          item.type === 'medium_armor' || 
          item.type === 'heavy_armor' ||
          (item.name && item.name.toLowerCase().includes('armadura'))
        ) || null;
      
      case 'mainHand':
        // Buscar arma principal (weapon, sword, etc.) - primera arma encontrada
        const weapons = equipment.filter(item => 
          item.type === 'weapon' || 
          item.type === 'special_weapon' ||
          (item.name && (
            item.name.toLowerCase().includes('espada') ||
            item.name.toLowerCase().includes('daga') ||
            item.name.toLowerCase().includes('hacha') ||
            item.name.toLowerCase().includes('maza') ||
            item.name.toLowerCase().includes('arco') ||
            item.name.toLowerCase().includes('ballesta')
          ))
        );
        return weapons[0] || null;
      
      case 'offHand':
        // Buscar segunda arma o escudo
        const offHandItems = equipment.filter(item => 
          item.type === 'weapon' || 
          item.type === 'shield' ||
          item.type === 'special_weapon'
        );
        // Si hay más de un arma, la segunda va en offHand
        return offHandItems[1] || null;
      
      case 'accessory':
        // Buscar accesorios mágicos (capa, anillo, amuleto, etc.)
        return equipment.find(item => 
          item.type === 'wondrous' || 
          item.type === 'ring' ||
          item.type === 'amulet' ||
          item.type === 'cloak' ||
          (item.name && (
            item.name.toLowerCase().includes('capa') ||
            item.name.toLowerCase().includes('anillo') ||
            item.name.toLowerCase().includes('amuleto')
          ))
        ) || null;
      
      default:
        return null;
    }
  };
  
  // Get selected item (from inventory or equipment)
  const getSelectedItem = () => {
    if (selectedEquipment !== null) {
      return getEquipmentBySlot(selectedEquipment);
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
  const handleEquipmentClick = (slotKey) => {
    setSelectedIndex(null);
    setSelectedEquipment(slotKey);
  };

  // Equipment slots definition
  const equipmentSlots = [
    { key: 'armor', name: 'Armadura', SlotIcon: ArmorIcon },
    { key: 'mainHand', name: 'Mano Principal', SlotIcon: MainHandIcon },
    { key: 'offHand', name: 'Mano Secundaria', SlotIcon: OffHandIcon },
    { key: 'accessory', name: 'Accesorio', SlotIcon: ScrollIcon },
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
              {equipmentSlots.map((slot) => {
                const slotItem = getEquipmentBySlot(slot.key);
                return (
                  <EquipmentSlot
                    key={slot.key}
                    item={slotItem}
                    slotName={slot.name}
                    SlotIcon={slot.SlotIcon}
                    onClick={() => slotItem && handleEquipmentClick(slot.key)}
                    isSelected={selectedEquipment === slot.key}
                  />
                );
              })}
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
