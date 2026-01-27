// src/components/admin/Header.jsx
import React from 'react';
import api from '../../services/api';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    await api.post('/logout');
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <h1 style={{ fontSize: '24px' }}>🎬 Cine - Panel Admin</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>Bienvenid@, {user.name || user.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: { 
    backgroundColor: '#1e40af', 
    color: '#fff', 
    padding: '16px' 
  },
  headerContent: { 
    maxWidth: '1280px', 
    margin: '0 auto', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutBtn: { 
    backgroundColor: '#dc2626', 
    color: '#fff', 
    padding: '8px 16px', 
    borderRadius: '6px', 
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  }
};