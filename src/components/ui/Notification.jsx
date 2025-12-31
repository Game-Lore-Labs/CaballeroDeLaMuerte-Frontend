// ============================================================================
// src/components/ui/Notification.jsx - Toast Notification Component
// ============================================================================

import React from 'react';
import './Notification.css';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <span className="notification-icon">✓</span>;
    case 'error':
      return <span className="notification-icon">✗</span>;
    case 'warning':
      return <span className="notification-icon">⚠</span>;
    default:
      return <span className="notification-icon">ℹ</span>;
  }
};

const Notification = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`notification notification--${type}`}>
      <NotificationIcon type={type} />
      <span className="notification-message">{message}</span>
      {onClose && (
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export const NotificationContainer = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notification;
