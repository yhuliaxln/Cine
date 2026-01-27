// src/pages/Login.jsx
import { useState } from 'react';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/empleado';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e5e7eb', // gris oficina
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* CUADRO LOGIN */}
      <div
        style={{
          width: '420px',
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '32px',
            color: '#111827',
          }}
        >
          🎬 Cine – Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin}>
          {error && (
            <p
              style={{
                color: '#dc2626',
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '500',
              }}
            >
              {error}
            </p>
          )}

          {/* EMAIL */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
              }}
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#2563eb',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
