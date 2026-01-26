// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import DashboardEmpleado from './pages/DashboardEmpleado.jsx'; // ← AJUSTA ESTA LÍNEA SI ES NECESARIO

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/empleado" element={<DashboardEmpleado />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);