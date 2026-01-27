import React from 'react';

export default function Modal({
  title,
  children,
  onClose,
  width = '500px',
  show = true,
  showCloseButton = true,
  footer,
  size = 'md' // 'sm', 'md', 'lg', 'xl'
}) {
  if (!show) return null;

  const getSize = () => {
    switch(size) {
      case 'sm': return '400px';
      case 'md': return '500px';
      case 'lg': return '700px';
      case 'xl': return '900px';
      default: return width;
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div 
        style={{ 
          ...styles.modalContent,
          width: getSize()
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button 
            style={styles.closeBtn} 
            onClick={onClose}
          >
            ✖
          </button>
        )}
        
        {title && (
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>{title}</h2>
          </div>
        )}
        
        <div style={styles.modalBody}>
          {children}
        </div>
        
        {footer && (
          <div style={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  modalHeader: {
    padding: '24px 24px 0 24px',
    borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  },
  modalBody: {
    padding: '24px'
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#f9fafb',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px'
  }
};