// src/components/admin/AdminLayout.jsx
import React from 'react';
import Header from './Header';
import NavBar from './NavBar';

export default function AdminLayout({ 
  children, 
  title, 
  subtitle, 
  actionButton,
  showHeader = true,
  showNavBar = true 
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
      {showHeader && <Header />}
      {showNavBar && <NavBar />}
      
      <main style={styles.main}>
        <div style={styles.panel}>
          {(title || subtitle || actionButton) && (
            <div style={styles.panelHeader}>
              <div>
                {title && <h2 style={styles.title}>{title}</h2>}
                {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
              </div>
              {actionButton && actionButton}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

const styles = {
  main: { 
    maxWidth: '1280px', 
    margin: '0 auto', 
    padding: '32px' 
  },
  panel: { 
    backgroundColor: '#fff', 
    borderRadius: '12px', 
    padding: '32px' 
  },
  panelHeader: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  title: { 
    fontSize: '30px', 
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '400'
  }
};