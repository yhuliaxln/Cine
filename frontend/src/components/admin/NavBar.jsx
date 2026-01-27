// src/components/admin/NavBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', label: ' Inicio', icon: '🏠' },
    { path: '/admin/peliculas', label: ' Películas', icon: '🎬' },
    { path: '/admin/salas', label: ' Salas', icon: '🎭' },
    { path: '/admin/usuarios', label: ' Usuarios', icon: '👥' },
    { path: '/admin/reportes', label: ' Reportes', icon: '📊' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.navBar}>
      <div style={styles.navContent}>
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={isActive(item.path) ? styles.navLinkActive : styles.navLink}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  navBar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 0'
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  navLink: {
    backgroundColor: 'transparent',
    color: '#4b5563',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  navLinkActive: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }
};