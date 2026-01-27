// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import DashboardEmpleado from './pages/DashboardEmpleado.jsx'; // ← AJUSTA ESTA LÍNEA SI ES NECESARIO
import VentaTicket from './pages/VentaTicket.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import AdminPeliculas from './pages/AdminPeliculas.jsx';
import AdminSalas from './pages/AdminSalas.jsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/empleado" element={<DashboardEmpleado />} />
        <Route path="/venta/:id" element={<VentaTicket />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/peliculas" element={<AdminPeliculas />} />
        <Route path="/admin/salas" element={<AdminSalas />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);