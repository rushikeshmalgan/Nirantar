import React from 'react';
import { motion } from 'framer-motion';

function Toast({ message, type, onClose }) {
  const getBackgroundColor = () => {
    switch(type) {
      case 'success': return 'rgba(34, 197, 94, 0.9)'; // Green
      case 'error': return 'rgba(239, 68, 68, 0.9)'; // Red
      case 'info': return 'rgba(56, 189, 248, 0.9)'; // Blue
      default: return 'rgba(244, 131, 31, 0.9)'; // Orange (Saffron)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      style={{
        background: getBackgroundColor(),
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        minWidth: '250px',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '0.85rem',
        fontWeight: 500,
        zIndex: 9999
      }}
    >
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'rgba(255,255,255,0.7)', 
          cursor: 'pointer', 
          fontSize: '1rem',
          padding: 0
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

export default Toast;
